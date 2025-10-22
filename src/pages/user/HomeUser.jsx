import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HomeUserPage = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] lg:min-h-screen bg-orange-50 dark:bg-gray-800 overflow-hidden flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20 py-16 lg:py-24">
              {/* Left: Text */}
              <motion.div
                className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-snug text-gray-900 dark:text-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Stay on top of your{" "}
                  <motion.span
                    className="text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    to-dos, capture, organize,
                  </motion.span>{" "}
                  and get them done from anywhere.
                </motion.h1>

                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Escape the clutter and chaos — unleash your productivity with
                  <span className="font-semibold text-primary"> TaskFlow</span>.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink
                      to={`/board/${
                        localStorage.getItem("current_workspace_id") || ""
                      }`}
                      className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium shadow-md transition duration-300"
                    >
                      Check Board{" "}
                      <ArrowRight className="inline-block w-4 h-4 ml-2" />
                    </NavLink>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right: Image */}
              <motion.div
                className="w-full lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
                {...floatingAnimation}
              >
                <motion.img
                  src="/assets/home/image1.png"
                  alt="TaskFlow productivity app"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl drop-shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Productivity Section */}
        <motion.div
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
              {/* Left Side - Text */}
              <motion.div className="lg:w-1/2" variants={slideInFromLeft}>
                <motion.h2
                  className="text-3xl sm:text-4xl font-bold text-primary mb-6 dark:text-blue-400"
                  variants={fadeInUp}
                >
                  Your productivity powerhouse
                </motion.h2>
                <motion.p
                  className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-10"
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  Turn ideas into action with Boards and Planner. Keep every
                  task organized and every project moving forward with{" "}
                  <span className="font-semibold">TaskFlow</span>.
                </motion.p>

                <motion.div
                  className="space-y-8"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    {
                      title: "Do-To",
                      description:
                        "A collection of planned tasks that have been defined, prioritized, and scheduled for future execution but not yet initiated.",
                    },
                    {
                      title: "In Progress",
                      description:
                        "Tasks that are actively being executed, with resources allocated and measurable work underway toward completion.",
                    },
                    {
                      title: "Done",
                      description:
                        "Fully completed tasks that have passed review or quality assurance and are formally released, delivered, or made available to the intended audience.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Side - Kanban Preview */}
              <motion.div
                className="lg:w-1/2 flex justify-center lg:justify-end"
                variants={slideInFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.img
                  src="/assets/home/image2.png"
                  alt="TaskFlow Board Preview"
                  className="w-full max-w-3xl rounded-xl shadow-lg"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Invite Section */}
        <motion.section
          className="relative bg-primary dark:bg-blue-700 pt-14 pb-65 px-6 lg:px-8 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Title + Description */}
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              variants={fadeInUp}
            >
              From message to invite by Gmail
            </motion.h2>
            <motion.p
              className="text-blue-100 dark:text-blue-200 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Quickly turn communication from your favorite apps into to-dos,
              keeping all your discussions and tasks organized in one place.
            </motion.p>
          </motion.div>
        </motion.section>

        {/* White box overlapping */}
        <motion.div
          className="relative max-w-6xl mx-auto -mt-50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full p-6 sm:p-10"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
              {/* Left Text */}
              <motion.div
                className="lg:w-1/2 text-left"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-secondary dark:text-orange-400 mb-6">
                  Invite by Gmail
                </h3>
                <motion.ul
                  className="space-y-3 text-gray-700 dark:text-gray-100 text-sm leading-relaxed"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Easily bring teammates on board with a single email invite sent through Gmail.",
                    "• Instant access — Recipients can join right away.",
                    "• Seamless updates — Tasks stay linked to Gmail.",
                    "• Controlled permissions — Secure access only for invited.",
                    "• Effortless onboarding — Simplified collaboration.",
                  ].map((text, index) => (
                    <motion.li
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ x: 5 }}
                    >
                      {text}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.img
                  src="/assets/home/image3.png"
                  alt="Invite Preview"
                  className="rounded-lg shadow-md w-full"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Heading */}
            <motion.div
              className="text-center mb-16"
              variants={staggerContainer}
            >
              <motion.h3
                className="text-lg font-semibold text-primary dark:text-blue-400 mb-2"
                variants={fadeInUp}
              >
                Work Smarter
              </motion.h3>
              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                variants={fadeInUp}
              >
                Do more with TaskFlow
              </motion.h2>
              <motion.p
                className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                variants={fadeInUp}
              >
                Customize the way you organize with easy integrations,
                automation, and reporting across multiple devices and locations.
              </motion.p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: "/assets/home/card1.png",
                  bgColor: "bg-blue-100",
                  title: "Features",
                  description:
                    "With TaskFlow, track all your projects at a glance on the Dashboard, collaborate seamlessly with your team, and manage tasks from to-do to done effortlessly.",
                  buttonText: "TaskFlow Features",
                  path: "/features",
                },
                {
                  icon: "/assets/home/card2.png",
                  bgColor: "bg-purple-100",
                  title: "Templates",
                  description:
                    "Perfect for creators and marketers to schedule, draft, and publish content. Organize by week, assign deadlines, and keep track of publishing platforms.",
                  buttonText: "Get to know Templates",
                  path: "/templates",
                },
                {
                  icon: "/assets/home/card3.png",
                  bgColor: "bg-orange-100",
                  title: "Task Management",
                  description:
                    "Organize projects from start to finish with clear task stages like To Do, In Progress, and Completed. Perfect for keeping your team on the same page.",
                  buttonText: "See more",
                  path: "/about",
                },
              ].map((card, index) => (
                <NavLink key={index} to={card.path}>
                  <motion.div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                    variants={fadeInScale}
                    whileHover={{
                      y: -10,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className={`w-16 h-16 ${card.bgColor} rounded-lg flex items-center justify-center mx-auto mb-6`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img src={card.icon} alt="" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                      {card.description}
                    </p>
                    <motion.button
                      className="px-5 py-2 rounded-lg border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white font-medium text-sm hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {card.buttonText}
                    </motion.button>
                  </motion.div>
                </NavLink>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.section
          className="py-30 px-6 lg:px-8 border-t border-b border-gray-300 dark:border-gray-400 mx-4 sm:mx-10 lg:mx-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl lg:text-4xl text-primary font-bold text-center mb-12"
              variants={fadeInUp}
            >
              Hear From Our <span className="text-orange-500">Happy Users</span>
            </motion.h2>

            {/* Scrollable container on mobile/tablet */}
            <motion.div
              className="
        flex lg:grid 
        lg:grid-cols-3 
        gap-6 sm:gap-8 
        overflow-x-auto lg:overflow-visible 
        snap-x snap-mandatory 
        scroll-smooth 
        pb-6
        scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600
      "
              variants={staggerContainer}
            >
              {[
                {
                  name: "Koem Channy",
                  image: "/assets/home/profile1.png",
                  role: "Singer",
                  text: "If you want a smooth, well-organized task app, go with TaskFlow. Their support team was always available, and the solutions they suggested were absolutely amazing!",
                },
                {
                  name: "Mr. Beast",
                  image: "/assets/home/profile2.png",
                  role: "Youtuber",
                  text: "Want a smooth and stress-free workflow? TaskFlow has you covered! Their support team is super helpful and always ready with amazing solutions.",
                },
                {
                  name: "Panha Watt",
                  image: "/assets/home/profile3.png",
                  role: "Student",
                  text: "TaskFlow made task management effortless. The support team was always there with brilliant solutions! Smooth workflow, excellent solutions — thanks TaskFlow!",
                },
              ].map((user, idx) => (
                <motion.div
                  key={idx}
                  className="
            relative bg-white dark:bg-gray-900 rounded-xl p-8 shadow-md text-center 
            flex-shrink-0 
            w-72 sm:w-80 md:w-96 
            snap-center 
            lg:w-auto
          "
                  variants={fadeInScale}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Blue vertical line behind avatar */}
                  <motion.div
                    className="absolute flex top-0 left-1/2 transform -translate-x-1/2 h-12 w-full bg-primary rounded-lg"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  ></motion.div>

                  {/* Avatar */}
                  <motion.div
                    className="relative z-10 w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md mb-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={user.image}
                      alt={user.role}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  <h4 className="font-semibold text-primary">{user.name}</h4>
                  <p className="text-gray-500 dark:text-gray-200 text-sm mb-5">
                    {user.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    "{user.text}"
                  </p>
                  <motion.div
                    className="text-yellow-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                  >
                    ⭐⭐⭐⭐⭐
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Development Team Carousel */}
        <motion.section
          className="py-24 px-6 lg:px-8 bg-white dark:bg-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }} // auto slide every 1s
              loop
              spaceBetween={40}
              slidesPerView={1}
              className="pb-12"
            >
              {[
                {
                  img: "/assets/About/Cholna.png",
                  name: "Tith Cholna",
                  role: "Student from ISTAD",
                  text: "ISTAD is the ideal place for anyone looking to improve their IT skills. Supportive environment, excellent teachers, and exposure to the latest technologies.",
                },
                {
                  img: "/assets/About/Dana.png",
                  name: "Dorn Dana",
                  role: "Student from ISTAD",
                  text: "If you want a smooth, well-organized task app, go with TaskFlow. Their support team was always available, and the solutions they suggested were amazing!",
                },
                {
                  img: "/assets/About/Sreynet.png",
                  name: "Mon Sreynet",
                  role: "Student",
                  text: "TaskFlow made task management effortless. Smooth workflow, excellent support — highly recommend it!",
                },
                {
                  img: "/assets/About/Manith.png",
                  name: "Rith Saramanith",
                  role: "Student",
                  text: "TaskFlow made task management effortless. Smooth workflow, excellent support — highly recommend it!",
                },
                {
                  img: "/assets/About/Smey.png",
                  name: "Lonh Raksmey",
                  role: "Student",
                  text: "TaskFlow made task management effortless. Smooth workflow, excellent support — highly recommend it!",
                },
                {
                  img: "/assets/About/Endy.png",
                  name: "Ong Endy",
                  role: "Student",
                  text: "TaskFlow made task management effortless. Smooth workflow, excellent support — highly recommend it!",
                },
              ].map((member, idx) => (
                <SwiperSlide key={idx}>
                  <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left profile */}
                    <motion.div className="lg:w-1/2 flex justify-center">
                      <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg hover:scale-105 hover:rotate-3 transition-transform duration-300">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>

                    {/* Right text */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                      <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-primary">
                        Development <span className="text-secondary">Team</span>
                      </h2>
                      <p className="text-gray-600 dark:text-gray-200 mb-6 leading-relaxed">
                        {member.text}
                      </p>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                        {member.role}
                      </p>
                      <NavLink
                        to="/about"
                        className="inline-block bg-white hover:bg-blue-700 border border-primary text-primary hover:!text-white px-6 py-2 rounded-lg shadow transition"
                      >
                        See more
                      </NavLink>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="w-full bg-gray-100 dark:bg-gray-800 py-24 px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Stay on top of your tasks and projects
          </motion.h2>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.button className="px-6 py-2 bg-primary text-white rounded-lg transition">
              <NavLink to="/board">Create a New Board</NavLink>
            </motion.button>
          </motion.div>
          <motion.p
            className="text-gray-600 dark:text-gray-400 mt-8 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Manage your boards, workspaces, and settings — all in one place.
          </motion.p>
        </motion.section>
      </div>
    </>
  );
};

export default HomeUserPage;
