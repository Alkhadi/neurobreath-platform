export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  status: 'approved' | 'pending';
}

export interface TestimonialSubmission {
  name: string;
  role: string;
  rating: number;
  quote: string;
  email?: string;
  consent: boolean;
}
