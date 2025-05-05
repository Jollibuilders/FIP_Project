export const getCommonQuestions = () => [
  {
    key: "fullName",
    question: "What is your full name?",
    type: "text",
    placeholder: "Enter your full name"
  },
  {
    key: "location",
    question: "Where are you located?",
    type: "text",
    placeholder: "City, State, Country"
  },
  {
    key: "school",
    question: "What school did you attend?",
    type: "text",
    placeholder: "Enter your school name"
  },
  {
    key: "currentJobTitle",
    question: "What is your current job title?",
    type: "text",
    placeholder: "Enter your current job title"
  },
  {
    key: "yearsOfExperience",
    question: "How many years of experience do you have?",
    type: "number",
    placeholder: "Enter number of years"
  },
  {
    key: "keySkills",
    question: "What are your key skills?",
    type: "tags",
    placeholder: "Add skills (comma separated)"
  }
];

export const getJobSeekerQuestions = () => [
  {
    key: "desiredJobTitle",
    question: "What job title are you looking for?",
    type: "text",
    placeholder: "Enter desired job title"
  },
  {
    key: "employmentType",
    question: "What type of employment are you looking for?",
    type: "select",
    options: ["Full-time", "Part-time", "Contract", "Internship"]
  },
  {
    key: "desiredLocation",
    question: "Where would you like to work?",
    type: "text",
    placeholder: "Enter desired location"
  },
  {
    key: "aboutMe",
    question: "Tell us about yourself",
    type: "textarea",
    placeholder: "Share a bit about yourself, your experience, and what you're looking for"
  }
];

export const getRecruiterQuestions = () => [
  {
    key: "companyName",
    question: "What company do you represent?",
    type: "text",
    placeholder: "Enter company name"
  },
  {
    key: "companySize",
    question: "What is the size of your company?",
    type: "select",
    options: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
  },
  {
    key: "companyLocation",
    question: "What location types does your company offer?",
    type: "multiselect",
    options: ["Remote", "Hybrid", "On-site"]
  },
  {
    key: "companyEmploymentType",
    question: "What employment types does your company offer?",
    type: "multiselect",
    options: ["Full-time", "Part-time", "Contract", "Internship"]
  },
  {
    key: "rolesHiringFor",
    question: "What roles are you hiring for?",
    type: "tags",
    placeholder: "Add roles (comma separated)"
  },
  {
    key: "contactEmail",
    question: "What email should candidates use to contact you?",
    type: "email",
    placeholder: "Enter contact email"
  },
  {
    key: "aboutMe",
    question: "Tell us about yourself and your company",
    type: "textarea",
    placeholder: "Share a bit about yourself, your company, and what you're looking for"
  }
];