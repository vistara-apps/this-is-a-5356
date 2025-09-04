-- AnimateFlow Database Schema
-- This file contains the SQL commands to set up the database schema in Supabase

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  animation_data JSONB NOT NULL DEFAULT '{}',
  duration REAL DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  animation_config JSONB NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_premium ON public.templates(is_premium);

-- Set up Row Level Security (RLS) policies

-- Users table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Projects table policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Templates table policies (read-only for users)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view templates" ON public.templates
  FOR SELECT USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON public.projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample templates
INSERT INTO public.templates (name, description, preview_url, animation_config, category, is_premium) VALUES
  (
    'Welcome Banner',
    'A simple welcome animation perfect for website headers',
    '/templates/welcome-banner.gif',
    '{
      "duration": 3,
      "elements": [
        {
          "id": "welcome-text",
          "type": "text",
          "content": "Welcome!",
          "keyframes": [
            {"time": 0, "x": -300, "y": 0, "scale": 0.5, "opacity": 0},
            {"time": 1.5, "x": 0, "y": 0, "scale": 1, "opacity": 1}
          ]
        }
      ]
    }',
    'social',
    false
  ),
  (
    'Logo Reveal',
    'Professional logo reveal animation for branding',
    '/templates/logo-reveal.gif',
    '{
      "duration": 4,
      "elements": [
        {
          "id": "logo",
          "type": "image",
          "keyframes": [
            {"time": 0, "scale": 0, "rotation": -180, "opacity": 0},
            {"time": 2, "scale": 1, "rotation": 0, "opacity": 1}
          ]
        }
      ]
    }',
    'branding',
    true
  ),
  (
    'Social Media Post',
    'Eye-catching animation for social media content',
    '/templates/social-post.gif',
    '{
      "duration": 5,
      "elements": [
        {
          "id": "background",
          "type": "shape",
          "keyframes": [
            {"time": 0, "scale": 0.8, "opacity": 0.8},
            {"time": 2.5, "scale": 1, "opacity": 1}
          ]
        },
        {
          "id": "text",
          "type": "text",
          "content": "Your Message Here",
          "keyframes": [
            {"time": 1, "y": 50, "opacity": 0},
            {"time": 3, "y": 0, "opacity": 1}
          ]
        }
      ]
    }',
    'social',
    false
  ),
  (
    'Product Showcase',
    'Premium template for showcasing products with style',
    '/templates/product-showcase.gif',
    '{
      "duration": 6,
      "elements": [
        {
          "id": "product",
          "type": "image",
          "keyframes": [
            {"time": 0, "x": -200, "rotation": -10, "opacity": 0},
            {"time": 2, "x": 0, "rotation": 0, "opacity": 1},
            {"time": 4, "scale": 1.1},
            {"time": 6, "scale": 1}
          ]
        }
      ]
    }',
    'marketing',
    true
  );

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
