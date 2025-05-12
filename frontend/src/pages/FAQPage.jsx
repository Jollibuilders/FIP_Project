import { motion } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

function FAQPage() {
    const faqs = [
        {question: "How do I get started?", answer: "When you sign up everyone is on the Free Plan. It's ideal for new mentees and allows all basic capabilites with unlimited connections." },
        {question: "How will I know when a mentor or mentee has connected with me?", answer: "You will be able to view this new connection through the Networks tab."},
        {question: "What is the point of the app?", answer: "The app is designed to help you connect with mentors and mentees. It allows you to find people who can help you grow in your career or personal life."},
        {question: "What is included in the Free Plan?", answer: "Well the Free plan allows unlimited access to mentors or mentees and our free plan allows to see others. We only have a free plan!"},
    ];
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex == index? null:index);
    };
    return (
        <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-20">
            <h1 className="text-3xl font-semibold text-center mb-6">Frequently Asked Questions</h1>
            <div className="space-y-4">
                {faqs.map((faqs, index)=>( 
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => toggleFAQ(index)}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">{faqs.question}</h2>
                            <motion.span
                                initial={{ rotate: 0 }}
                                animate={{ rotate: openIndex === index ? 90 : 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-black-500 text-xl focus:outline-none"
                            >
                                {openIndex === index ? <FaTimes /> : <FaPlus />}
                            </motion.span>
                        </div>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <p className="mt-2 text-gray-600">{faqs.answer}</p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default FAQPage;