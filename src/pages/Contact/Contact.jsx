import React, { useState, useEffect, useRef } from "react";
import { Header } from "../../layouts/header/header";
import "./Contact.css";
import "../../styles/animation.css";
import { Footer } from "../../layouts/footer/footer";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const form = useRef();

  useEffect(() => {
    const formElement = document.getElementById("form");
    if (formElement) {
      window.scrollBy(0, 280);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          console.log("SUCCESS!");
          toast.success("Message sent successfully!");
          setFormData({ user_name: "", user_email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Message failed to send. Please try again.");
        }
      );
  };

  return (
    <>
      <Header />

      <div className="contact-container">
        <main className="contact-content animated user-select-none">
          <h1 className="contact-title">Liên hệ với chúng tôi</h1>
          <article className="contact-frame" id="form">
            <section className="contact-info">
              <h2>Thông tin liên hệ</h2>
              <p className="text-light">
                Có thắc mắc hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi bằng cách
                sử dụng hoặc thông tin liên hệ của chúng tôi bên dưới.
              </p>
              <ul>
                <li>
                  <i className="fas fa-envelope"></i> info@example.com
                </li>
                <li>
                  <i className="fas fa-phone"></i> (123) 456-7890
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i> 123 Main St, City,
                  State 12345
                </li>
              </ul>
            </section>

            <section className="contact-form">
              <form ref={form} className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Tên</label>
                  <input
                    type="text"
                    id="name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    placeholder="Họ và tên"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                    placeholder="Địa chỉ email của bạn"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Nhập nội dung</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </section>
          </article>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
