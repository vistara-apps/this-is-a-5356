import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase'

export const projectService = {
  // Get all projects for current user
  async getUserProjects(userId, options = {}) {
    try {
      const { limit = 50, offset = 0, sortBy = 'updated_at', sortOrder = 'desc' } = options

      let query = supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error
      
      return handleSupabaseSuccess({
        projects: data || [],
        total: count,
        hasMore: data && data.length === limit
      })
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get a single project by ID
  async getProject(projectId, userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Create a new project
  async createProject(userId, projectData) {
    try {
      const { name, animation_data = {}, duration = 5.0 } = projectData

      if (!name || name.trim().length === 0) {
        throw new Error('Project name is required')
      }

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert([
          {
            user_id: userId,
            name: name.trim(),
            animation_data,
            duration
          }
        ])
        .select()
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update an existing project
  async updateProject(projectId, userId, updates) {
    try {
      const allowedFields = ['name', 'animation_data', 'duration']
      const filteredUpdates = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key]
          return obj
        }, {})

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('No valid fields to update')
      }

      // Validate name if provided
      if (filteredUpdates.name && filteredUpdates.name.trim().length === 0) {
        throw new Error('Project name cannot be empty')
      }

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update(filteredUpdates)
        .eq('id', projectId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Delete a project
  async deleteProject(projectId, userId) {
    try {
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      if (error) throw error
      
      return handleSupabaseSuccess(true)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Duplicate a project
  async duplicateProject(projectId, userId, newName = null) {
    try {
      // First get the original project
      const originalResult = await this.getProject(projectId, userId)
      if (!originalResult.success) {
        throw new Error(originalResult.error)
      }

      const original = originalResult.data
      const duplicateName = newName || `${original.name} (Copy)`

      // Create the duplicate
      const duplicateData = {
        name: duplicateName,
        animation_data: original.animation_data,
        duration: original.duration
      }

      return await this.createProject(userId, duplicateData)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Search projects by name
  async searchProjects(userId, searchTerm, options = {}) {
    try {
      const { limit = 20, offset = 0 } = options

      if (!searchTerm || searchTerm.trim().length === 0) {
        return this.getUserProjects(userId, { limit, offset })
      }

      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .ilike('name', `%${searchTerm.trim()}%`)
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      
      return handleSupabaseSuccess({
        projects: data || [],
        searchTerm: searchTerm.trim(),
        hasMore: data && data.length === limit
      })
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get recent projects
  async getRecentProjects(userId, limit = 5) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      return handleSupabaseSuccess(data || [])
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Create project from template
  async createProjectFromTemplate(userId, templateId, projectName) {
    try {
      // Get template data
      const { data: template, error: templateError } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      if (!template) throw new Error('Template not found')

      // Create project with template data
      const projectData = {
        name: projectName || `${template.name} Project`,
        animation_data: template.animation_config,
        duration: template.animation_config.duration || 5.0
      }

      return await this.createProject(userId, projectData)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Validate animation data structure
  validateAnimationData(animationData) {
    try {
      if (!animationData || typeof animationData !== 'object') {
        return { valid: false, error: 'Animation data must be an object' }
      }

      // Check for required fields
      if (!animationData.elements || !Array.isArray(animationData.elements)) {
        return { valid: false, error: 'Animation data must contain an elements array' }
      }

      // Validate each element
      for (const element of animationData.elements) {
        if (!element.id || typeof element.id !== 'string') {
          return { valid: false, error: 'Each element must have a string id' }
        }

        if (!element.type || !['text', 'image', 'shape'].includes(element.type)) {
          return { valid: false, error: 'Each element must have a valid type (text, image, or shape)' }
        }

        if (!element.keyframes || !Array.isArray(element.keyframes)) {
          return { valid: false, error: 'Each element must have a keyframes array' }
        }

        // Validate keyframes
        for (const keyframe of element.keyframes) {
          if (typeof keyframe.time !== 'number' || keyframe.time < 0) {
            return { valid: false, error: 'Each keyframe must have a valid time value' }
          }
        }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'Invalid animation data structure' }
    }
  }
}
