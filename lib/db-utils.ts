import { query } from "./db"

// Utilitários para operações comuns no banco
export async function getUserById(id: number) {
  const result = await query("SELECT * FROM users WHERE id = ?", [id])
  return (result as any)[0]
}

export async function getUserByUsername(username: string) {
  const result = await query("SELECT * FROM users WHERE username = ?", [username])
  return (result as any)[0]
}

export async function createPost(userId: number, content: string, imageUrl?: string) {
  const result = await query("INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)", [
    userId,
    content,
    imageUrl || null,
  ])
  return result
}

export async function getPostsWithAuthor(limit = 20, offset = 0) {
  const result = await query(
    `
    SELECT 
      p.id,
      p.content,
      p.image_url,
      p.likes_count,
      p.comments_count,
      p.created_at,
      u.id as author_id,
      u.full_name as author,
      u.username as handle,
      u.avatar_url
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `,
    [limit, offset],
  )
  return result
}

export async function likePost(postId: number, userId: number) {
  try {
    await query("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)", [postId, userId])
    await query("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?", [postId])
    return true
  } catch (error) {
    console.error("Error liking post:", error)
    return false
  }
}

export async function unlikePost(postId: number, userId: number) {
  try {
    await query("DELETE FROM post_likes WHERE post_id = ? AND user_id = ?", [postId, userId])
    await query("UPDATE posts SET likes_count = likes_count - 1 WHERE id = ? AND likes_count > 0", [postId])
    return true
  } catch (error) {
    console.error("Error unliking post:", error)
    return false
  }
}

export async function getFriends(userId: number) {
  const result = await query(
    `
    SELECT 
      u.id,
      u.full_name as name,
      u.username as handle,
      u.bio,
      u.avatar_url
    FROM friendships f
    JOIN users u ON (f.friend_id = u.id)
    WHERE f.user_id = ? AND f.status = 'accepted'
    UNION
    SELECT 
      u.id,
      u.full_name as name,
      u.username as handle,
      u.bio,
      u.avatar_url
    FROM friendships f
    JOIN users u ON (f.user_id = u.id)
    WHERE f.friend_id = ? AND f.status = 'accepted'
  `,
    [userId, userId],
  )
  return result
}

export async function getProjects(userId: number) {
  const result = await query(
    `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.repository_url,
      p.language,
      p.stars_count,
      p.forks_count,
      p.status,
      p.created_at,
      COUNT(DISTINCT pm.user_id) as members_count
    FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `,
    [userId],
  )
  return result
}

export async function getTasks(projectId: number) {
  const result = await query(
    `
    SELECT 
      t.id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.created_at,
      u.full_name as assigned_to_name,
      u.username as assigned_to_handle
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.project_id = ?
    ORDER BY 
      CASE WHEN t.status = 'todo' THEN 1
           WHEN t.status = 'in_progress' THEN 2
           WHEN t.status = 'review' THEN 3
           ELSE 4 END,
      t.due_date ASC
  `,
    [projectId],
  )
  return result
}

export async function getUpcomingEvents(userId: number) {
  const result = await query(
    `
    SELECT 
      id,
      title,
      description,
      start_date,
      end_date,
      location,
      type
    FROM events
    WHERE user_id = ? AND start_date >= NOW()
    ORDER BY start_date ASC
    LIMIT 10
  `,
    [userId],
  )
  return result
}

export async function getActivities(userId: number, limit = 20) {
  const result = await query(
    `
    SELECT 
      id,
      action,
      target_type,
      target_id,
      description,
      created_at
    FROM activities
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `,
    [userId, limit],
  )
  return result
}

export async function getSavedPosts(userId: number, limit = 20, offset = 0) {
  const result = await query(
    `
    SELECT 
      p.id,
      p.content,
      p.image_url,
      p.likes_count,
      p.comments_count,
      p.created_at,
      u.id as author_id,
      u.full_name as author,
      u.username as handle,
      u.avatar_url
    FROM saved_posts sp
    JOIN posts p ON sp.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE sp.user_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `,
    [userId, limit, offset],
  )
  return result
}

export async function savePost(userId: number, postId: number) {
  try {
    await query("INSERT INTO saved_posts (user_id, post_id) VALUES (?, ?)", [userId, postId])
    return true
  } catch (error) {
    return false
  }
}

export async function createActivity(
  userId: number,
  action: string,
  targetType?: string,
  targetId?: number,
  description?: string,
) {
  await query("INSERT INTO activities (user_id, action, target_type, target_id, description) VALUES (?, ?, ?, ?, ?)", [
    userId,
    action,
    targetType || null,
    targetId || null,
    description || null,
  ])
}

export async function createTask(
  projectId: number,
  title: string,
  description: string,
  priority: string,
  createdBy: number,
  dueDate?: string,
  assignedTo?: number,
) {
  const result = await query(
    "INSERT INTO tasks (project_id, title, description, priority, created_by, due_date, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [projectId, title, description, priority, createdBy, dueDate || null, assignedTo || null],
  )
  return result
}

export async function updateTaskStatus(taskId: number, status: string) {
  const result = await query("UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?", [status, taskId])
  return result
}

export async function getUpcomingEventsUser(userId: number) {
  const result = await query(
    `
    SELECT 
      id,
      title,
      description,
      start_date,
      end_date,
      location,
      type
    FROM events
    WHERE user_id = ? AND start_date >= NOW()
    ORDER BY start_date ASC
    LIMIT 10
  `,
    [userId],
  )
  return result
}

export async function createEvent(
  userId: number,
  title: string,
  description: string,
  startDate: string,
  endDate?: string,
  location?: string,
  type?: string,
  projectId?: number,
) {
  const result = await query(
    "INSERT INTO events (user_id, project_id, title, description, start_date, end_date, location, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [userId, projectId || null, title, description, startDate, endDate || null, location || null, type || "event"],
  )
  return result
}

export async function createProject(
  userId: number,
  name: string,
  description: string,
  language?: string,
  repositoryUrl?: string,
) {
  const result = await query(
    "INSERT INTO projects (user_id, name, description, language, repository_url) VALUES (?, ?, ?, ?, ?)",
    [userId, name, description, language || null, repositoryUrl || null],
  )
  return result
}

export async function addProjectMember(projectId: number, userId: number, role = "contributor") {
  try {
    const result = await query("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)", [
      projectId,
      userId,
      role,
    ])
    return result
  } catch (error) {
    console.error("Error adding project member:", error)
    return null
  }
}

export async function getUserSettings(userId: number) {
  const result = await query("SELECT * FROM user_settings WHERE user_id = ?", [userId])
  return (result as any)[0]
}

export async function updateUserSettings(userId: number, settings: Record<string, any>) {
  const allowedFields = [
    "theme",
    "notifications_enabled",
    "email_notifications",
    "privacy_level",
    "show_email",
    "show_activity",
  ]

  let updateQuery = "UPDATE user_settings SET "
  const values: any[] = []

  Object.entries(settings).forEach(([key, value], index) => {
    if (allowedFields.includes(key)) {
      if (index > 0) updateQuery += ", "
      updateQuery += `${key} = ?`
      values.push(value)
    }
  })

  updateQuery += ", updated_at = NOW() WHERE user_id = ?"
  values.push(userId)

  const result = await query(updateQuery, values)
  return result
}

export async function getComments(postId: number) {
  const result = await query(
    `
    SELECT 
      c.id,
      c.content,
      c.created_at,
      u.full_name as author,
      u.username as handle,
      u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `,
    [postId],
  )
  return result
}

export async function createComment(postId: number, userId: number, content: string) {
  const result = await query("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)", [
    postId,
    userId,
    content,
  ])
  await query("UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?", [postId])
  return result
}
