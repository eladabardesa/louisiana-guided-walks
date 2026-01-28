'use client';

import { useState, FormEvent } from 'react';

// Configuration for tour dates
const TOUR_DATES = [
  {
    id: 'walk-1',
    title: 'Pilot walk #1',
    date: 'Tuesday, Feb 10',
    time: '16:00',
    language: 'English',
    capacity: 'Small group (approx. 10)',
  },
  {
    id: 'walk-2',
    title: 'Pilot walk #2',
    date: 'Tuesday, Feb 17',
    time: '17:30',
    language: 'Hebrew',
    capacity: 'Small group (approx. 10)',
  },
] as const;

// API endpoint for form submissions
const API_ENDPOINT = '/api/signup';

type FormData = {
  selectedDate: string;
  fullName: string;
  email: string;
  phone: string;
  note: string;
  newsletter: boolean;
};

type FormErrors = {
  selectedDate?: string;
  fullName?: string;
  email?: string;
};

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    selectedDate: '',
    fullName: '',
    email: '',
    phone: '',
    note: '',
    newsletter: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDateSelect = (dateId: string) => {
    setSelectedDate(dateId);
    setFormData((prev) => ({ ...prev, selectedDate: dateId }));
    // Clear date error when a date is selected
    if (errors.selectedDate) {
      setErrors((prev) => ({ ...prev, selectedDate: undefined }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Please select a tour date';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const selectedTour = TOUR_DATES.find((tour) => tour.id === formData.selectedDate);
      
      const payload = {
        selectedDate: selectedTour
          ? `${selectedTour.title} - ${selectedTour.date} at ${selectedTour.time} (${selectedTour.language})`
          : formData.selectedDate,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        note: formData.note || '',
        newsletter: formData.newsletter,
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          selectedDate: '',
          fullName: '',
          email: '',
          phone: '',
          note: '',
          newsletter: false,
        });
        setSelectedDate('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:px-8 sm:py-16 lg:py-20">
        {/* Header */}
        <header className="mb-16 sm:mb-20">
          <h1 className="mb-4 text-3xl font-light tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            An attentive walk with Elad at Louisiana
          </h1>
          <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
            I'm inviting a small group of friends and colleagues to join me for two pilot guided walks in the museum. The focus is on attention, listening, and shared looking.
          </p>
        </header>

        {/* About the initiative */}
        <section className="mb-16 sm:mb-20">
          <h2 className="mb-4 text-xl font-normal text-gray-900 sm:text-2xl">
            About the initiative
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            <p>
              This is a pilot format exploring slow looking and dialogue in the museum space. These walks are not lectures—they are conversations, moments of shared attention where we look together and listen to what emerges.
            </p>
            <p>
              The small group size allows for genuine dialogue and ensures everyone can participate. We'll move slowly, pause often, and create space for reflection and exchange.
            </p>
          </div>
        </section>

        {/* About me */}
        <section className="mb-16 sm:mb-20">
          <h2 className="mb-4 text-xl font-normal text-gray-900 sm:text-2xl">
            About me
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-gray-700 sm:text-lg">
            <p>
              I'm Elad, and my background spans sound, music, and education. I guide through listening and conversation, creating spaces where we can slow down and attend to what's present.
            </p>
            <p>
              These pilot walks are a personal invitation—an experiment in how we might experience art together with more attention and less hurry.
            </p>
          </div>
        </section>

        {/* Tour date selection */}
        <section className="mb-12 sm:mb-16">
          <h2 className="mb-6 text-xl font-normal text-gray-900 sm:text-2xl">
            Join one of the pilot walks
          </h2>
          
          <div className="mb-8 space-y-4">
            {TOUR_DATES.map((tour) => (
              <button
                key={tour.id}
                type="button"
                onClick={() => handleDateSelect(tour.id)}
                aria-pressed={selectedDate === tour.id}
                className={`w-full text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                  selectedDate === tour.id
                    ? 'ring-2 ring-gray-900'
                    : 'ring-1 ring-gray-300 hover:ring-gray-400'
                }`}
              >
                <div className="bg-white p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl">
                        {tour.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 sm:text-base">
                        <p>{tour.date}</p>
                        <p>{tour.time}</p>
                        <p>Language: {tour.language}</p>
                        <p className="mt-2 text-gray-500">{tour.capacity}</p>
                      </div>
                    </div>
                    <div
                      className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedDate === tour.id
                          ? 'border-gray-900 bg-gray-900'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selectedDate === tour.id && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {errors.selectedDate && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.selectedDate}
            </p>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                Full name <span className="text-gray-500">(required)</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none ${
                  errors.fullName ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Your full name"
              />
              {errors.fullName && (
                <p id="fullName-error" className="mt-2 text-sm text-red-600" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email <span className="text-gray-500">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                placeholder="+45 12 34 56 78"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-900 mb-2">
                Note <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="w-full border-b border-gray-300 bg-transparent px-0 py-2 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-900 focus:outline-none resize-none"
                placeholder="Any questions or comments?"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 shrink-0 border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label htmlFor="newsletter" className="ml-3 text-sm leading-relaxed text-gray-700">
                I'd like to get updates about future walks
              </label>
            </div>

            {/* Success message */}
            {submitStatus === 'success' && (
              <div
                className="rounded-sm bg-gray-50 p-4 text-sm text-gray-900"
                role="alert"
              >
                <p className="font-medium">Thank you!</p>
                <p className="mt-1">Your details have been sent. I'll be in touch soon.</p>
              </div>
            )}

            {/* Error message */}
            {submitStatus === 'error' && (
              <div
                className="rounded-sm bg-red-50 p-4 text-sm text-red-900"
                role="alert"
              >
                <p className="font-medium">Something went wrong</p>
                <p className="mt-1">
                  Please try again, or contact me directly if the problem persists.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-8 w-full border border-gray-900 bg-gray-900 px-6 py-4 text-base font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8 ${
                isSubmitting ? '' : 'hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? 'Sending…' : 'Send my details'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
