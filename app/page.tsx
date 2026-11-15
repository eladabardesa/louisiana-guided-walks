import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="page-section pb-0">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
            <div className="lg:col-span-7 max-w-2xl">
              <h1 className="text-gray-900 text-4xl sm:text-5xl font-light tracking-tight leading-[1.08] mb-6">
                Attentive Art
                <br />
                Encounters
              </h1>
              <div className="space-y-4 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
                <p>
                  I&rsquo;m inviting you to one or two walks at Louisiana. We&rsquo;ll take time to
                  look, to listen, to be with the artworks, and to see what happens when they look
                  back.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/guitar.png" alt="" className="w-1/2 max-w-[14rem] h-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">About the walk</h2>
            <div className="space-y-5 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              <p>
                A museum, for me, is a place of freedom. Of expression, emotions, and intellect. A
                place that raises questions, challenges what we think we already know, puts up a
                mirror, shows beauty and ugliness side by side, and lets us see the world through
                the eyes of artists and curators.
              </p>
              <p>
                And still, many of us were taught that a museum is a place where you should be
                quiet. Where you don&rsquo;t really speak. Where the masters know better than you.
              </p>
              <p>
                In these walks, I&rsquo;d like to offer something else. To come as you are. To ask
                questions, to disagree, to talk, to feel, and to feel OK about it.
              </p>
              <p>
                We&rsquo;ll walk slowly. We&rsquo;ll stop often. We&rsquo;ll leave space for
                conversation, silence, and whatever comes up.
              </p>
            </div>
            <p className="mt-8 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              The walk itself is free of charge.
              <br />
              A regular museum entrance ticket is required (unless you are a member).
            </p>
            <p className="mt-4 text-base sm:text-lg text-gray-700 font-light leading-relaxed">
              The dates aren&rsquo;t set yet. Write to me if you want to come.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-6 rounded-lg px-6 py-3 text-sm text-white bg-[#102033] hover:bg-[#1a3348]"
            >
              Write to me
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="page-container">
          <div className="max-w-2xl">
            <h2 className="text-lg sm:text-xl font-normal text-gray-900 mb-4">What people wrote</h2>
            <div className="space-y-6">
              {[
                {
                  quote:
                    'The guided art walk through New Works at the Louisiana Museum of Modern Art on 10 February 2026 with Elad Bardes felt less like a conventional museum tour and more like a shared act of looking. Rather than searching for the ‘correct’ interpretation, the exercises prompted us to notice details, observe our reactions, and reflect on how a work affects us personally.',
                  author: 'Marina Scandi · Google Review',
                },
                {
                  quote:
                    'I would dare to say that this museum walk changed the way I approach art. Before this tour, I perceived a museum as a place where you have to study, focusing mainly on reading every single explanation for each artwork rather than engaging with the art itself. This experience, however, was the complete opposite - for the first time, visiting a museum actually felt like entertainment.',
                  author: 'Chebumashka · Google Review',
                },
                {
                  quote:
                    'I joined Elad on a tour in Louisiana, and he is a thoughtful guide who brings great sensitivity, knowledge, and openness. His engaging insights and guidance help create a meaningful and personal dialogue with the art exhibits.',
                  author: 'Gili Y · Google Review',
                },
              ].map((review) => (
                <div key={review.author}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-gray-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-sm text-gray-700 leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-xs text-gray-400">{review.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
