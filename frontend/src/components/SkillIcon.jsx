const SkillIcon = ({ text }) => {
    return (
        <div className="inline-block bg-gray-200 rounded-md px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" >
            <span className="text-gray-700">{text}</span>
        </div>
    );
};

export default SkillIcon;