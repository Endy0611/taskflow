// src/pages/AboutUs.jsx
import React, { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";

const AboutUs = () => {
  // ======= Form State =======
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  // ======= Mentor Data =======
  // (Removed unused mentors variable)

  // ======= Team Members Data =======
  const members = [
    {
      name: "Ms. Dorn Dana",
      role: "Web Design",
      img: "/assets/About/Dana.png",
      github: "https://github.com/danadorn",
      linkedin: "#",
      email: "#",
      quote:
        "I am human compiler who turn nonsense requirements into broken code and pretend like I know why.",
    },
    {
      name: "Mr. Rith Saranamith",
      role: "Java App",
      img: "/assets/About/Manith.png",
      github: "https://github.com/Manith991",
      linkedin: "#",
      email: "#",
      quote:
        "Git commit messages should really just say: 'I have no idea what I'm doing, but it works.'",
    },
    {
      name: "Mr. Ong Endy",
      role: "Java App",
      img: "/assets/About/Endy.png",
      github: "https://github.com/Endy0611",
      linkedin: "#",
      email: "endyong18@gmail.com",
      quote:
        "Coffee in one hand, confidence in the other, and a brilliant algorithm in my head.",
    },
    {
      name: "Ms. Mon Sreynet",
      role: "Web Design",
      img: "/assets/About/Sreynet.png",
      github: "https://github.com/sreynetmon",
      linkedin: "#",
      email: "sreynet1409@gmail.com",
      quote:
        "My greatest achievement isn't the code I've written, but the problems I've solved from my coding.",
    },
    {
      name: "Ms. Tith Cholna",
      role: "Web Design",
      img: "/assets/About/Cholna.png",
      github: "https://github.com/Activity007",
      linkedin: "#",
      email: "#",
      quote:
        "Dark mode isn’t just a feature... it’s how developers hide their tears in the UI.",
    },
    {
      name: "Lonh Raksmey",
      role: "Web Design",
      img: "/assets/About/Smey.png",
      github: "https://github.com/stupiqqsmey",
      linkedin: "#",
      email: "#",
      quote:
        "I am human compiler who turn nonsense requirements into broken code and then act like we know why.",
    },
  ];

  return (
    <div className="space-y-20 bg-white dark:bg-gray-900 transition-colors duration-300 py-14 lg:py-20">
      {/* About Section */}
      <section className="bg-white dark:bg-gray-900 py-10 sm:py-14 md:py-16 ">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
              About <span className="text-primary">TaskFlow</span>
            </h1>
            <p className="text-gray-600 font-bold dark:text-gray-300 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
              TaskFlow{" "}
              <span className="font-normal">
                was founded with the belief that planning should never be
                overwhelming. It started as a simple idea to help individuals or
                teams track daily tasks more effectively.
              </span>
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/assets/home/about1.png"
              alt="Team collaboration"
              className="w-3/4 sm:w-2/3 md:w-full"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className=" bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-8">
          <div className="flex-1 flex justify-center">
            <img
              src="/assets/home/about2.png"
              alt="Mission illustration"
              className="w-3/4 sm:w-2/3 md:w-full max-w-md mx-auto"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed font-bold px-2 sm:px-0">
              TaskFlow's{" "}
              <span className="font-normal">
                vision is to make work organization simple, visual, and powerful
                for everyone. We aim to create a platform where individuals and
                teams can efficiently manage their workflows, enabling them to
                focus on what truly matters: getting things done and achieving
                success.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative bg-white dark:bg-gray-900 py-10 sm:py-12 md:py-20 px-3 sm:px-5 md:px-12 border border-purple-800 dark:border-white mx-3 sm:mx-6 md:mx-24 rounded-3xl">
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-8 sm:mb-12">
            Contact Us
          </h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Get in Touch */}
            <div className="flex-1 relative p-[1.5px] rounded-2xl bg-gradient-to-r from-blue-600 via-orange-600 to-red-500 shadow-xl">
              <div className="bg-white/85 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-5 sm:p-7 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-secondary dark:text-white mb-3 sm:mb-5 text-center lg:text-left">
                    Get in Touch
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base text-center lg:text-left leading-relaxed">
                    Feel free to reach out if you have any questions or need
                    assistance.
                  </p>

                  <div className="space-y-5 mb-6">
                    {/* Email */}
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="bg-primary p-2.5 rounded-xl">
                        <FiMail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          Email Us
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 break-all">
                          taskflow@gmail.com
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="bg-primary p-2.5 rounded-xl">
                        <FiPhone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          Call Us
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          +855 12 345 78
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="text-center lg:text-left">
                  <p className="font-semibold mb-3 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                    Follow our social media
                  </p>
                  <div className="flex gap-4 justify-center lg:justify-start mt-3 flex-wrap">
                    <FaFacebook className="text-primary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-125 transition" />
                    <FaTwitter className="text-primary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-125 transition" />
                    <FaLinkedin className="text-primary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-125 transition" />
                    <FaInstagram className="text-primary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-125 transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Send Message Form */}
            <div className="flex-1 bg-white dark:bg-gray-800 p-5 sm:p-7 rounded-2xl shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-secondary mb-4 sm:mb-5 text-center lg:text-left">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="flex-1 p-2.5 sm:p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 p-2.5 sm:p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 font-semibold text-sm sm:text-base transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-14 md:mb-25 lg:mb-30">
          <div className="flex-grow h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <h2 className="mx-6 text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white tracking-wide flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-orange-500 to-red-500">
              ✦ Our Mentors ✦
            </span>
          </h2>
          <div className="flex-grow h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        <div className="space-y-16 md:space-y-25 max-w-6xl mx-auto ">
          {/* Mentor 1 */}
          <div className="flex flex-col md:flex-row rounded-3xl shadow-xl">
            {/* Image Side */}
            <div className="relative md:w-1/2 bg-primary flex justify-center items-end rounded-tl-3xl">
              <img
                src="/assets/About/cher chhaya.png"
                alt="Mr. Chan Chhaya"
                className="w-52 sm:w-60 md:w-72 object-contain relative md:absolute md:bottom-0"
              />
            </div>

            {/* Info Side */}
            <div className="md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 text-left flex flex-col justify-center rounded-br-3xl">
              <h3 className="text-2xl font-semibold text-primary dark:text-white">
                Mr. Chan Chhaya
              </h3>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Offer support in Java & API
              </p>
              <p className="mt-2 text-primary text-lg dark:text-gray-300 font-medium">
                Mentor
              </p>

              <div className="mt-4 space-y-4">
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaGithub className="text-primary w-6 h-6" />
                  <a
                    href="https://github.com/it-chhaya"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/it-chhaya
                  </a>
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FiMail className="text-primary w-6 h-6" />
                  <a href="mailto:it.chhaya@gmail.com">it.chhaya@gmail.com</a>
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaLinkedin className="text-primary w-6 h-6" />
                  <a
                    href="https://www.linkedin.com/in/chan-chhaya"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.linkedin.com/in/chan-chhaya
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Mentor 2 */}
          <div className="flex flex-col md:flex-row-reverse rounded-3xl shadow-xl">
            {/* Image Side */}
            <div className="relative md:w-1/2 bg-primary flex justify-center items-end rounded-tr-3xl">
              <img
                src="/assets/About/cher cheat.png"
                alt="Ms. Srong Sokcheat"
                className="w-52 sm:w-60 md:w-72 object-contain relative md:absolute md:bottom-0"
              />
            </div>

            {/* Info Side */}
            <div className="md:w-1/2 bg-gray-50 dark:bg-gray-800 p-8 text-left flex flex-col justify-center rounded-bl-3xl">
              <h3 className="text-2xl font-semibold text-primary dark:text-blue-400">
                Ms. Srorng Sokcheat
              </h3>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Offer support in Web Design
              </p>
              <p className="mt-2 text-primary text-lg dark:text-gray-300 font-medium">
                Mentor
              </p>

              <div className="mt-6 space-y-4">
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaGithub className="text-primary w-6 h-6" />
                  <a
                    href="https://github.com/Sokcheatsrorng"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/Sokcheatsrorng
                  </a>
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FiMail className="text-primary w-6 h-6" />
                  <a href="mailto:sokcheat@email.com">sokcheat@email.com</a>
                </p>
                <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <FaLinkedin className="text-primary w-6 h-6" />
                  <a
                    href="https://www.linkedin.com/in/srorng-sokcheat"
                    target="_blank"
                    rel="noreferrer"
                  >
                    www.linkedin.com/in/srorng-sokcheat
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-20 md:mb-25 lg:mb-30">
          <div className="hidden md:block flex-grow h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          <h2 className="mx-2 sm:mx-4 md:mx-8 lg:mx-6 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white tracking-wide flex items-center gap-2 justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">
              <span className="inline-block">⚡️</span>
              <span className="inline-block mx-1 sm:mx-2">Team Members</span>
              <span className="inline-block">⚡️</span>
            </span>
          </h2>
          <div className="hidden md:block flex-grow h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 justify-items-center">
          {members.map((member, i) => (
            <div
              key={i}
              className="relative bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md p-6 text-left w-full max-w-md transition hover:shadow-md mt-14 md:mt-16 lg:mt-0"
            >
              {/* Top Badge */}
              <div className="absolute -top-10 md:-top-12 lg:-top-13 left-2 md:left-1/4 md:-translate-x-1/2 lg:-left-10 lg:translate-x-0 bg-primary z-20 text-white px-4 md:px-6 lg:px-30 py-2 md:py-2.5 lg:py-3 h-auto lg:h-25 rounded-tr-xl rounded-tl-xl rounded-bl-xl overflow-hidden min-w-[150px] md:min-w-[180px] lg:min-w-0">
                <div className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-[#173187] absolute -left-4 md:-left-4.5 lg:-left-5 bottom-0"></div>
                <h3 className="font-semibold text-sm md:text-base relative z-10">
                  {member.name}
                </h3>
                <p className="text-xs md:text-sm opacity-80 relative z-10">
                  {member.role}
                </p>
              </div>

              {/* Content */}
              <div>
                {/* Quote */}
                <p className="mt-8 md:mt-9 lg:mt-10 italic text-sm md:text-base text-gray-700 dark:text-gray-300">
                  " {member.quote} "
                </p>

                {/* Icons */}
                <div className="flex gap-4 mt-6 md:mt-7 lg:mt-8 text-xl md:text-2xl text-primary">
                  <a href={member.github} target="_blank" rel="noreferrer">
                    <FaGithub className="hover:scale-110 transition-transform" />
                  </a>
                  <a href={member.email} target="_blank" rel="noreferrer">
                    <FiMail className="hover:scale-110 transition-transform" />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    <FaLinkedin className="hover:scale-110 transition-transform" />
                  </a>
                </div>

                {/* Profile Pic */}
                <div className="absolute -top-8 md:-top-10 lg:-top-12 right-2 md:right-4 lg:-right-1 w-20 h-20 md:w-22 md:h-22 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-orange-500 shadow-md z-20">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
