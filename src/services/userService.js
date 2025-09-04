import { supabase, TABLES, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase'

export const userService = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      if (!user) return handleSupabaseSuccess(null)

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Create user profile (called automatically via trigger)
  async createUserProfile(userId, email) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([
          {
            id: userId,
            email: email,
            subscription_tier: 'free'
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

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update subscription tier
  async updateSubscriptionTier(userId, tier) {
    try {
      if (!['free', 'pro'].includes(tier)) {
        throw new Error('Invalid subscription tier')
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({ subscription_tier: tier })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Check if user has pro subscription
  async hasProSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('subscription_tier')
        .eq('id', userId)
        .single()

      if (error) throw error
      
      return handleSupabaseSuccess(data?.subscription_tier === 'pro')
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      // Get project count
      const { count: projectCount, error: projectError } = await supabase
        .from(TABLES.PROJECTS)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (projectError) throw projectError

      // Get user profile
      const userResult = await this.getCurrentUser()
      if (!userResult.success) throw new Error(userResult.error)

      const stats = {
        projectCount: projectCount || 0,
        subscriptionTier: userResult.data?.subscription_tier || 'free',
        memberSince: userResult.data?.created_at
      }
      
      return handleSupabaseSuccess(stats)
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Delete user account (cascade will delete projects)
  async deleteUserAccount(userId) {
    try {
      const { error } = await supabase
        .from(TABLES.USERS)
        .delete()
        .eq('id', userId)

      if (error) throw error
      
      return handleSupabaseSuccess(true)
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}
