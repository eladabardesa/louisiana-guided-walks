'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { venues } from '@/lib/venues';

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  venue: string;
  tourType: string;
  note: string;
  newsletter: boolean;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  venue?: string;
  tourType?: string;
};

function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedVenue = searchParams.get('venue') || '';
  const preselectedTourType = searchParams.get('tourType') || '';

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    venue: preselectedVenue,
    tourType: preselectedTourType,
    note: '',
    newsletter: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...(preselectedVenue && { venue: preselectedVenue }),
      ...(preselectedTourType && { tourType: preselectedTourType }),
    }));
  }, [preselectedVenue, preselectedTourType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.venue) newErrors.venue = 'Please select a venue';
    if (!formData.tourType) newErrors.tourType = 'Please select a tour type';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const venueName = venues.find((v) => v.slug === formData.venue)?.name || formData.venue;

      const payload = {
        selectedDate: `${venueName} — ${formData.tourType}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        venue: formData.venue,
        tourType: formData.tourType,
        note: formData.note || '',
        newsletter: formData.newsletter,
        ticketQuantity: 1,
      };

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            venue: '',
            tourType: '',
            note: '',
            newsletter: false,
          });
          setSubmitStatus('idle');
        }, 10000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (fieldName: keyof FormErrors) =>
    `w-full border-b bg-transparent px-0 py-3 text-base text-gray-900 placeholder-gray-300 transition-colors focus:outline-none ${
      errors[fieldName]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-gray-900'
    }`;

  return (
    <>
      {submitStatus === 'success' && (
        <div className="mb-8 bg-gray-50 p-6 border border-gray-200" role="alert">
          <p className="text-base font-normal text-gray-900">Thank you!</p>
          <p className="text-sm text-gray-600 mt-1">
            Your message has been sent. I&rsquo;ll be in touch soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 bg-red-50 p-6 border border-red-200" role="alert">
          <p className="text-base font-normal text-red-900">Something went wrong</p>
          <p className="text-sm text-red-700 mt-1">
            Please try again, or reach me directly at{' '}
            <a href="mailto:eladbardes@gmail.com" className="underline">
              eladbardes@gmail.com
            </a>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Full name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!errors.fullName}
            className={fieldClass('fullName')}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            className={fieldClass('email')}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!errors.phone}
            className={fieldClass('phone')}
            placeholder="+45 12 34 56 78"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="venue" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Venue
          </label>
          <select
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!errors.venue}
            className={fieldClass('venue')}
          >
            <option value="">Select a venue</option>
            {venues.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
          {errors.venue && (
            <p className="mt-1 text-xs text-red-500">{errors.venue}</p>
          )}
        </div>

        <div>
          <label htmlFor="tourType" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Experience type
          </label>
          <select
            id="tourType"
            name="tourType"
            value={formData.tourType}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!errors.tourType}
            className={fieldClass('tourType')}
          >
            <option value="">Select a type</option>
            <option value="regular">Regular walk</option>
            <option value="families-couples">Families &amp; couples</option>
            <option value="teambuilding">Teambuilding</option>
          </select>
          {errors.tourType && (
            <p className="mt-1 text-xs text-red-500">{errors.tourType}</p>
          )}
        </div>

        <div>
          <label htmlFor="note" className="block text-xs tracking-widest uppercase text-gray-400 mb-2">
            Message <span className="normal-case text-gray-300">(optional)</span>
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows={3}
            className="w-full border-b border-gray-200 bg-transparent px-0 py-3 text-base text-gray-900 placeholder-gray-300 transition-colors focus:border-gray-900 focus:outline-none resize-none"
            placeholder="Any questions or preferences?"
          />
        </div>

        <div className="flex items-start pt-2">
          <input
            type="checkbox"
            id="newsletter"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleInputChange}
            className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="newsletter" className="ml-3 text-sm text-gray-500 leading-relaxed">
            I&rsquo;d like to get updates about upcoming walks
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 w-full py-4 text-sm sm:text-base tracking-wide font-medium text-white bg-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isSubmitting ? '' : 'hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? 'Sending\u2026' : 'Send my details'}
        </button>
      </form>

      {/* Direct contact */}
      <div className="mt-14 pt-8 border-t border-gray-100">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">
          Or reach me directly
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/4591764091"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="mailto:eladbardes@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            Email
          </a>
          <a
            href="tel:+4591764091"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            +45 91 76 40 91
          </a>
        </div>
      </div>
    </>
  );
}

export default function ContactPage() {
  return (
    <main>
      <section className="page-section">
        <div className="page-container">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 mb-3">
              Get in touch
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-light mb-10 sm:mb-14">
              Interested in a walk? Fill in your details and I&rsquo;ll get back to you.
            </p>

            <Suspense fallback={<div className="text-gray-400">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
