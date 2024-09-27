document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("background-animation");

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();

    const particles = [];
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseRadius = 150;

    let mouse = {
      x: null,
      y: null,
      radius: mouseRadius,
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.angle = Math.random() * 360;
        this.velocity = 0.01;
        this.color = Math.random() < 0.5 ? "#64ffda" : "#ffd700";
      }

      update() {
        this.angle += this.velocity;
        this.x = this.baseX + Math.cos((this.angle * Math.PI) / 180) * 30;
        this.y = this.baseY + Math.sin((this.angle * Math.PI) / 180) * 30;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density * 0.3;
        let directionY = forceDirectionY * force * this.density * 0.3;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }

      draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a192f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animate);
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            let opacity = 1 - distance / connectionDistance;
            let strokeColor =
              particles[i].color === particles[j].color
                ? particles[i].color
                : "#e6f1ff";
            ctx.strokeStyle = `${strokeColor}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            let midX = (particles[i].x + particles[j].x) / 2;
            let midY = (particles[i].y + particles[j].y) / 2;
            let xDiff = Math.abs(particles[i].x - particles[j].x);
            let yDiff = Math.abs(particles[i].y - particles[j].y);
            let curvature = Math.sqrt(xDiff * xDiff + yDiff * yDiff) * 0.3;
            ctx.quadraticCurveTo(
              midX,
              midY - curvature,
              particles[j].x,
              particles[j].y
            );
            ctx.stroke();
          }
        }
      }
    }

    window.addEventListener("mousemove", function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });

    window.addEventListener("resize", function () {
      resizeCanvas();
      init();
    });

    init();
    animate();

    const ctaButton = document.querySelector(".cta-button");

    ctaButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href =
        "mailto:service@servicegood.com?subject=Get%20Started%20Inquiry";
    });
  } else {
    console.log("Canvas not supported");
    canvas.style.display = "none";
  }

  const hero = document.querySelector("#hero");
  const title = hero.querySelector("h1");
  const subtitle = hero.querySelector("p");
  const cta = hero.querySelector(".cta-button");

  hero.addEventListener("mousemove", (e) => {
    let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    title.style.transform = `translateZ(50px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    subtitle.style.transform = `translateZ(30px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    cta.style.transform = `translateZ(20px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  hero.addEventListener("mouseleave", () => {
    title.style.transform = "translateZ(0px) rotateY(0deg) rotateX(0deg)";
    subtitle.style.transform = "translateZ(0px) rotateY(0deg) rotateX(0deg)";
    cta.style.transform = "translateZ(0px) rotateY(0deg) rotateX(0deg)";
  });

  title.addEventListener("mouseenter", () => {
    title.style.transform = "scale(1.05) translateZ(50px)";
    title.style.color = "var(--accent-primary)";
  });

  title.addEventListener("mouseleave", () => {
    title.style.transform = "scale(1) translateZ(0px)";
    title.style.color = "var(--text-primary)";
  });

  cta.addEventListener("mouseenter", () => {
    cta.style.transform = "scale(1.1) translateZ(50px)";
  });

  cta.addEventListener("mouseleave", () => {
    cta.style.transform = "scale(1) translateZ(0px)";
  });

  const serviceCards = document.querySelectorAll(".service-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  serviceCards.forEach((card) => {
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });

  const aboutParagraphs = document.querySelectorAll("#about p");

  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  aboutParagraphs.forEach((p) => {
    aboutObserver.observe(p);
  });
});
