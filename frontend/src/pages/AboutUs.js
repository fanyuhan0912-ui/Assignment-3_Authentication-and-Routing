import aboutMemory1 from "../assets/about-memory-1.jpg";
import aboutMemory2 from "../assets/about-memory-2.jpg";
import aboutMemory3 from "../assets/about-memory-3.jpg";

const memories = [
  {
    image: aboutMemory1,
    alt: "Two dogs sitting in the grass",
    className: "memory-card",
  },
  {
    image: aboutMemory2,
    alt: "Two smiling dogs on the grass",
    className: "memory-card",
  },
  {
    image: aboutMemory3,
    alt: "Two happy dogs posing together",
    className: "memory-card",
  },
];

const testimonials = [
  {
    name: "Emily R.",
    text: "Thanks to this organization, we found our perfect companion. The care and love they give to every pet truly shows.",
  },
  {
    name: "Jason M.",
    text: "The adoption process was simple and heartfelt. You can tell they genuinely care about each pet's future.",
  },
  {
    name: "Linda K.",
    text: "Our pet came to us happy, healthy, and well cared for. We've been grateful for everything this team shares.",
  },
  {
    name: "Sarah T.",
    text: "An amazing experience from start to finish. They helped us find a pet that fit perfectly into our family.",
  },
  {
    name: "Daniel W.",
    text: "A wonderful organization that truly puts pets first. Highly recommend to anyone looking to adopt.",
  },
];

function AboutUs() {
  return (
    <section className="about-page">
      <div className="about-shell">
        <div className="section-heading about-heading">
          <h1>ABOUT US</h1>
        </div>

        <section className="about-intro-card">
          <img
            className="about-intro-image"
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
            alt="Two puppies on the grass"
          />

          <div className="about-intro-copy">
            <h2>Introduction</h2>
            <p>
              For over 3 years, we have been a caring organization dedicated to
              serving the lives of every homeless pet in our community. Every
              pet deserves safety, loving care, and a second chance to be part
              of a family.
            </p>
            <p>
              Our mission is to support every pet through proper care,
              attention, and resources, while creating homes where they can feel
              safe, loved, and ready to grow into a happy life. Every pet
              deserves a chance, and we are proud to be part of their journey.
            </p>
            <span className="about-intro-tag">Pet Loving</span>
          </div>
        </section>

        <section className="about-memory-section">
          <div className="about-memory-heading">
            <h2>Because every pet deserves a home</h2>
          </div>

          <div className="about-section-label">
            <h3>Memory</h3>
          </div>

          <div className="about-memory-grid">
            {memories.map((memory) => (
              <article className={memory.className} key={memory.alt}>
                <img src={memory.image} alt={memory.alt} />
              </article>
            ))}
          </div>
        </section>

        <section className="about-testimonial-section">
          <div className="about-section-label">
            <h3>Testimonial</h3>
          </div>

          <div className="about-testimonial-grid">
            {testimonials.map((testimonial) => (
              <article className="about-testimonial-card" key={testimonial.name}>
                <h4>{testimonial.name} ✨</h4>
                <p>{testimonial.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default AboutUs;
