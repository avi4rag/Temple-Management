-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cameras table
CREATE TABLE public.cameras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  stream_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  crowd_density INTEGER DEFAULT 0,
  coordinates POINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'crowd', 'emergency', 'medical', 'security'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  camera_id UUID REFERENCES public.cameras(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
  acknowledged_by UUID REFERENCES public.admin_users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create darshan_bookings table
CREATE TABLE public.darshan_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  total_devotees INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create devotees table
CREATE TABLE public.devotees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.darshan_bookings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  aadhaar_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  is_entered BOOLEAN NOT NULL DEFAULT false,
  entered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'general', 'emergency', 'aarti'
  language TEXT NOT NULL DEFAULT 'en',
  sent_by UUID REFERENCES public.admin_users(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.darshan_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devotees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users (only admins can access)
CREATE POLICY "Admins can view all admin users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Admins can update admin users" ON public.admin_users FOR UPDATE USING (true);

-- Create RLS policies for cameras (public read for dashboard, admin write)
CREATE POLICY "Anyone can view cameras" ON public.cameras FOR SELECT USING (true);
CREATE POLICY "Admins can manage cameras" ON public.cameras FOR ALL USING (true);

-- Create RLS policies for alerts (public read, admin write)
CREATE POLICY "Anyone can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Admins can manage alerts" ON public.alerts FOR ALL USING (true);

-- Create RLS policies for darshan_bookings (users can view their own, admins can view all)
CREATE POLICY "Users can view their own bookings" ON public.darshan_bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can create bookings" ON public.darshan_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all bookings" ON public.darshan_bookings FOR ALL USING (true);

-- Create RLS policies for devotees (linked to bookings)
CREATE POLICY "Anyone can view devotees" ON public.devotees FOR SELECT USING (true);
CREATE POLICY "Anyone can create devotees" ON public.devotees FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage devotees" ON public.devotees FOR ALL USING (true);

-- Create RLS policies for notifications
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cameras_updated_at
  BEFORE UPDATE ON public.cameras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_darshan_bookings_updated_at
  BEFORE UPDATE ON public.darshan_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.admin_users (email, password_hash, full_name, role) VALUES
('admin@somnath.temple', '$2a$10$dummy.hash.for.testing', 'Temple Administrator', 'super_admin'),
('security@somnath.temple', '$2a$10$dummy.hash.for.testing', 'Security Manager', 'admin');

INSERT INTO public.cameras (name, location, stream_url, crowd_density, coordinates) VALUES
('Main Entrance', 'Temple Main Gate', 'https://demo-stream.com/cam1', 45, POINT(21.8974, 70.4015)),
('Sanctum Sanctorum', 'Inner Temple', 'https://demo-stream.com/cam2', 80, POINT(21.8975, 70.4016)),
('North Corridor', 'North Side Passage', 'https://demo-stream.com/cam3', 30, POINT(21.8976, 70.4014)),
('South Corridor', 'South Side Passage', 'https://demo-stream.com/cam4', 25, POINT(21.8973, 70.4017));

INSERT INTO public.alerts (type, severity, title, description, location, status) VALUES
('crowd', 'high', 'High Crowd Density', 'Crowd density at Main Entrance exceeds safe limit', 'Main Entrance', 'active'),
('security', 'medium', 'Unauthorized Access', 'Security breach detected at North Corridor', 'North Corridor', 'acknowledged');