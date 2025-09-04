import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase'

export const templateService = {
  // Get all templates with optional filtering
  async getTemplates(options = {}) {
    try {
      const { 
        category = null, 
        isPremium = null, 
        limit = 50, 
        offset = 0,
        searchTerm = null 
      } = options

      let query = supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (category) {
        query = query.eq('category', category)
      }

      if (isPremium !== null) {
        query = query.eq('is_premium', isPremium)
      }

      if (searchTerm && searchTerm.trim().length > 0) {
        query = query.or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`)
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error
      
      return handleSupabaseSuccess({
        templates: data || [],
        total: count,
        hasMore: data && data.length === limit
      })
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get a single template by ID
  async getTemplate(templateId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('id', templateId)
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get templates by category
  async getTemplatesByCategory(category, options = {}) {
    try {
      const { limit = 20, offset = 0, includePremium = true } = options

      let query = supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (!includePremium) {
        query = query.eq('is_premium', false)
      }

      const { data, error } = await query

      if (error) throw error
      
      return handleSupabaseSuccess(data || [])
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get free templates only
  async getFreeTemplates(options = {}) {
    try {
      const { limit = 20, offset = 0, category = null } = options

      let query = supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('is_premium', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      
      return handleSupabaseSuccess(data || [])
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get premium templates only
  async getPremiumTemplates(options = {}) {
    try {
      const { limit = 20, offset = 0, category = null } = options

      let query = supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('is_premium', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      
      return handleSupabaseSuccess(data || [])
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get available categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEMPLATES)
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))]
        .filter(category => category && category.trim().length > 0)
        .sort()
      
      return handleSupabaseSuccess(categories)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Search templates
  async searchTemplates(searchTerm, options = {}) {
    try {
      const { limit = 20, offset = 0, category = null, includePremium = true } = options

      if (!searchTerm || searchTerm.trim().length === 0) {
        return this.getTemplates({ limit, offset, category, isPremium: includePremium ? null : false })
      }

      let query = supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      if (!includePremium) {
        query = query.eq('is_premium', false)
      }

      const { data, error } = await query

      if (error) throw error
      
      return handleSupabaseSuccess({
        templates: data || [],
        searchTerm: searchTerm.trim(),
        hasMore: data && data.length === limit
      })
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get featured templates (non-premium, popular categories)
  async getFeaturedTemplates(limit = 6) {
    try {
      const { data, error } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*')
        .eq('is_premium', false)
        .in('category', ['social', 'branding', 'marketing'])
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      return handleSupabaseSuccess(data || [])
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Check if user can access template (based on subscription)
  async canAccessTemplate(templateId, userSubscriptionTier = 'free') {
    try {
      const templateResult = await this.getTemplate(templateId)
      if (!templateResult.success) {
        return handleSupabaseError(new Error('Template not found'))
      }

      const template = templateResult.data
      const canAccess = !template.is_premium || userSubscriptionTier === 'pro'
      
      return handleSupabaseSuccess({
        canAccess,
        template,
        requiresUpgrade: template.is_premium && userSubscriptionTier !== 'pro'
      })
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get template statistics
  async getTemplateStats() {
    try {
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Get free count
      const { count: freeCount, error: freeError } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', false)

      if (freeError) throw freeError

      // Get premium count
      const { count: premiumCount, error: premiumError } = await supabase
        .from(TABLES.TEMPLATES)
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true)

      if (premiumError) throw premiumError

      const stats = {
        total: totalCount || 0,
        free: freeCount || 0,
        premium: premiumCount || 0
      }
      
      return handleSupabaseSuccess(stats)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Validate template animation config
  validateTemplateConfig(animationConfig) {
    try {
      if (!animationConfig || typeof animationConfig !== 'object') {
        return { valid: false, error: 'Animation config must be an object' }
      }

      // Check for required fields
      if (!animationConfig.elements || !Array.isArray(animationConfig.elements)) {
        return { valid: false, error: 'Animation config must contain an elements array' }
      }

      if (typeof animationConfig.duration !== 'number' || animationConfig.duration <= 0) {
        return { valid: false, error: 'Animation config must have a valid duration' }
      }

      // Validate each element
      for (const element of animationConfig.elements) {
        if (!element.id || typeof element.id !== 'string') {
          return { valid: false, error: 'Each element must have a string id' }
        }

        if (!element.type || !['text', 'image', 'shape'].includes(element.type)) {
          return { valid: false, error: 'Each element must have a valid type' }
        }

        if (!element.keyframes || !Array.isArray(element.keyframes)) {
          return { valid: false, error: 'Each element must have a keyframes array' }
        }

        // Validate keyframes
        for (const keyframe of element.keyframes) {
          if (typeof keyframe.time !== 'number' || keyframe.time < 0) {
            return { valid: false, error: 'Each keyframe must have a valid time value' }
          }

          if (keyframe.time > animationConfig.duration) {
            return { valid: false, error: 'Keyframe time cannot exceed animation duration' }
          }
        }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'Invalid animation config structure' }
    }
  }
}
