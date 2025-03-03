import { useState } from "react";
import { FaSearch } from "react-icons/fa";
function FAQPage(){
    const faqs = [
        { question: "How do I get started?", answer: "When you sign up, you’ll start with the Free plan. It's ideal for new teams and allows unlimited team members, but only 1 active editable project at a time. For more advanced features, check out our Basic, Premium, or Enterprise plans." },
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
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-16">
        <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
        <div className="relative mb-6">
            <input type="text" placeholder="Search for a question" className="w-full p-3 pl-10 border rounded-full shadow-sm focus:outline-none"/>
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20}/>
        </div>
    <div className="space-y-4">
        {faqs.map((faqs, index)=>( 
            <div key={index} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => toggleFAQ(index)}>
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{faqs.question}</h2>
                    <button className="text-gray-500 text-xl focus:outline-none">
                                {openIndex == index ? "✖" : "+"}
                            </button>   
                         </div>
            {openIndex == index && <p className="mt-2 text-gray-600">{faqs.answer}</p>}
        </div>
        ))}
    </div>
    </div>
);
}
export default FAQPage;