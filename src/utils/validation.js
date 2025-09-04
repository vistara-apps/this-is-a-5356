// Validation utilities for AnimateFlow

export const validation = {
  // Email validation
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Password validation
  isValidPassword(password) {
    return password && password.length >= 6
  },

  // Project name validation
  isValidProjectName(name) {
    return name && name.trim().length > 0 && name.trim().length <= 100
  },

  // Animation duration validation
  isValidDuration(duration) {
    return typeof duration === 'number' && duration > 0 && duration <= 60
  },

  // Keyframe time validation
  isValidKeyframeTime(time, maxDuration) {
    return typeof time === 'number' && time >= 0 && time <= maxDuration
  },

  // Element ID validation
  isValidElementId(id) {
    return typeof id === 'string' && id.trim().length > 0 && id.length <= 50
  },

  // Element type validation
  isValidElementType(type) {
    return ['text', 'image', 'shape'].includes(type)
  },

  // Color validation (hex format)
  isValidColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  },

  // Numeric value validation with range
  isValidNumericValue(value, min = -Infinity, max = Infinity) {
    return typeof value === 'number' && !isNaN(value) && value >= min && value <= max
  },

  // File type validation for uploads
  isValidImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml']
    return file && allowedTypes.includes(file.type)
  },

  // File size validation (in bytes)
  isValidFileSize(file, maxSizeInMB = 10) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file && file.size <= maxSizeInBytes
  },

  // Template category validation
  isValidCategory(category) {
    const validCategories = ['social', 'branding', 'marketing', 'general', 'education', 'entertainment']
    return validCategories.includes(category)
  },

  // Subscription tier validation
  isValidSubscriptionTier(tier) {
    return ['free', 'pro'].includes(tier)
  },

  // Animation element validation
  validateAnimationElement(element) {
    const errors = []

    if (!this.isValidElementId(element.id)) {
      errors.push('Element ID is required and must be a valid string')
    }

    if (!this.isValidElementType(element.type)) {
      errors.push('Element type must be text, image, or shape')
    }

    if (!element.keyframes || !Array.isArray(element.keyframes)) {
      errors.push('Element must have a keyframes array')
    } else if (element.keyframes.length === 0) {
      errors.push('Element must have at least one keyframe')
    }

    // Validate keyframes
    if (element.keyframes) {
      element.keyframes.forEach((keyframe, index) => {
        if (typeof keyframe.time !== 'number' || keyframe.time < 0) {
          errors.push(`Keyframe ${index + 1} must have a valid time value`)
        }

        // Validate position values
        if (keyframe.x !== undefined && !this.isValidNumericValue(keyframe.x, -2000, 2000)) {
          errors.push(`Keyframe ${index + 1} x position must be between -2000 and 2000`)
        }

        if (keyframe.y !== undefined && !this.isValidNumericValue(keyframe.y, -2000, 2000)) {
          errors.push(`Keyframe ${index + 1} y position must be between -2000 and 2000`)
        }

        // Validate scale
        if (keyframe.scale !== undefined && !this.isValidNumericValue(keyframe.scale, 0.1, 10)) {
          errors.push(`Keyframe ${index + 1} scale must be between 0.1 and 10`)
        }

        // Validate rotation
        if (keyframe.rotation !== undefined && !this.isValidNumericValue(keyframe.rotation, -360, 360)) {
          errors.push(`Keyframe ${index + 1} rotation must be between -360 and 360 degrees`)
        }

        // Validate opacity
        if (keyframe.opacity !== undefined && !this.isValidNumericValue(keyframe.opacity, 0, 1)) {
          errors.push(`Keyframe ${index + 1} opacity must be between 0 and 1`)
        }
      })
    }

    // Type-specific validations
    if (element.type === 'text') {
      if (!element.content || typeof element.content !== 'string') {
        errors.push('Text element must have content')
      }

      if (element.fontSize && !this.isValidNumericValue(element.fontSize, 8, 200)) {
        errors.push('Font size must be between 8 and 200')
      }

      if (element.color && !this.isValidColor(element.color)) {
        errors.push('Text color must be a valid hex color')
      }
    }

    if (element.type === 'image') {
      if (!element.src || typeof element.src !== 'string') {
        errors.push('Image element must have a source URL')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Full animation data validation
  validateAnimationData(animationData) {
    const errors = []

    if (!animationData || typeof animationData !== 'object') {
      return {
        isValid: false,
        errors: ['Animation data must be an object']
      }
    }

    if (!this.isValidDuration(animationData.duration)) {
      errors.push('Animation duration must be a number between 0 and 60 seconds')
    }

    if (!animationData.elements || !Array.isArray(animationData.elements)) {
      errors.push('Animation must contain an elements array')
    } else {
      if (animationData.elements.length === 0) {
        errors.push('Animation must have at least one element')
      }

      // Validate each element
      animationData.elements.forEach((element, index) => {
        const elementValidation = this.validateAnimationElement(element)
        if (!elementValidation.isValid) {
          errors.push(`Element ${index + 1}: ${elementValidation.errors.join(', ')}`)
        }

        // Check keyframe times against animation duration
        if (element.keyframes && animationData.duration) {
          element.keyframes.forEach((keyframe, kfIndex) => {
            if (keyframe.time > animationData.duration) {
              errors.push(`Element ${index + 1}, Keyframe ${kfIndex + 1}: time exceeds animation duration`)
            }
          })
        }
      })

      // Check for duplicate element IDs
      const elementIds = animationData.elements.map(el => el.id)
      const duplicateIds = elementIds.filter((id, index) => elementIds.indexOf(id) !== index)
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate element IDs found: ${duplicateIds.join(', ')}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Sanitize user input
  sanitizeString(str, maxLength = 255) {
    if (typeof str !== 'string') return ''
    return str.trim().substring(0, maxLength)
  },

  // Sanitize numeric input
  sanitizeNumber(num, min = -Infinity, max = Infinity, defaultValue = 0) {
    const parsed = parseFloat(num)
    if (isNaN(parsed)) return defaultValue
    return Math.max(min, Math.min(max, parsed))
  }
}
