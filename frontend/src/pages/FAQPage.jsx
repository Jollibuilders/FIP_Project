import { motion } from "framer-motion";
import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

function FAQPage() {
    const faqs = [
        {question: "How do I get started?", answer: "When you sign up, you’ll start with the Free plan. It's ideal for new teams and allows unlimited team members, but only 1 active editable project at a time. For more advanced features, check out our Basic, Premium, or Enterprise plans." },
        {question: "What is included in the Free Plan?", answer: "place holder answer"},
        {question: "What is included in the Free Plan?", answer: "placeholder answer"},
        {question: "How do I cancel my membership?", answer: "placeholder answer"},
        {question: "How do I transfer my membership to a different account?", answer: "placeholder answer"},
        {question: "What is the refund policy?", answer: "placeholder answer"},
    ];
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex == index? null:index);
    };
    return (
        <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-20">
            <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
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