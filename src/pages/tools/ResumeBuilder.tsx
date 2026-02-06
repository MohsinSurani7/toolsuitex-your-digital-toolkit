import { useState, useRef } from "react";
import { Plus, Trash2, Download, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    linkedin: string;
    website: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
    linkedin: "",
    website: ""
  },
  education: [],
  experience: [],
  skills: []
};

export default function ResumeBuilderPage() {
  const tool = getToolById("resume-builder")!;
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem("toolsuitex-resume");
    return saved ? JSON.parse(saved) : defaultResumeData;
  });
  const [activeTab, setActiveTab] = useState("personal");
  const resumeRef = useRef<HTMLDivElement>(null);

  const saveToLocalStorage = (data: ResumeData) => {
    localStorage.setItem("toolsuitex-resume", JSON.stringify(data));
    toast.success("Resume saved!");
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: 50
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: string, value: string | number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    toast.info("Generating PDF...");
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${resumeData.personalInfo.fullName || "resume"}-resume.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const seoContent = {
    description: "Learn everything about creating professional, ATS-friendly resumes that get you interviews. Our comprehensive guide covers formatting, keywords, and best practices.",
    content: `
      <h3>How to Create a Professional Resume in 2024</h3>
      <p>Creating a standout resume is crucial in today's competitive job market. An ATS-friendly resume not only catches the attention of recruiters but also passes through Applicant Tracking Systems that many companies use to filter candidates.</p>
      
      <h4>Key Elements of an Effective Resume</h4>
      <p>Your resume should include these essential sections: a clear professional summary, detailed work experience with quantifiable achievements, relevant education, and a skills section that matches job requirements. Each section should be optimized with industry-specific keywords.</p>
      
      <h4>ATS Optimization Tips</h4>
      <p>To ensure your resume passes ATS screening, use standard section headings, avoid complex formatting like tables and graphics, and include keywords from the job description. Our resume builder automatically formats your content for maximum ATS compatibility.</p>
      
      <h4>Professional Summary Best Practices</h4>
      <p>Your professional summary should be 2-3 sentences highlighting your experience level, key skills, and career goals. Use action verbs and quantify achievements whenever possible. This section is your elevator pitch to potential employers.</p>
      
      <h4>Formatting for Success</h4>
      <p>Use a clean, professional font like Arial or Calibri at 10-12pt size. Maintain consistent spacing and alignment throughout. Use bullet points for easy scanning and keep your resume to 1-2 pages depending on experience level.</p>
    `,
    keywords: [
      "Free Online Resume Maker",
      "ATS-Friendly CV",
      "Professional Resume Builder",
      "Job Application Template",
      "Career Resume Generator",
      "Resume Templates 2024",
      "CV Builder Online",
      "Resume Writing Tips",
      "Professional CV Maker",
      "Job Resume Creator"
    ],
    faqs: [
      {
        question: "Is this resume builder completely free?",
        answer: "Yes! Our resume builder is 100% free to use. There are no hidden fees, subscriptions, or premium features locked behind a paywall. You can create, edit, and download your resume as many times as you need."
      },
      {
        question: "Is my resume data secure and private?",
        answer: "Absolutely. All resume data is stored locally in your browser using localStorage. We never upload your personal information to any server. Your data stays on your device at all times."
      },
      {
        question: "What is an ATS-friendly resume?",
        answer: "An ATS (Applicant Tracking System) friendly resume is formatted in a way that can be easily parsed by software that companies use to screen job applications. Our builder creates resumes with proper headings, standard fonts, and clean formatting that ATS systems can read."
      },
      {
        question: "Can I download my resume as a PDF?",
        answer: "Yes! You can download your completed resume as a high-quality PDF file. The PDF is formatted for standard letter/A4 paper size and is ready for printing or email submission."
      },
      {
        question: "Will my resume data be saved if I close the browser?",
        answer: "Yes, your resume data is automatically saved to your browser's local storage. When you return to the resume builder, your previous work will be restored automatically."
      },
      {
        question: "How long should my resume be?",
        answer: "For most professionals, a 1-page resume is ideal if you have less than 10 years of experience. Senior professionals or those in academic fields may use 2 pages. Our builder helps you organize content to fit appropriately."
      }
    ],
    aboutTool: "The ToolSuiteX Resume Builder is a comprehensive, browser-based tool designed to help job seekers create professional, ATS-optimized resumes. Built with modern web technologies, it offers real-time preview, automatic saving, and PDF export capabilities. Unlike other resume builders, all processing happens locally in your browser, ensuring complete privacy of your personal information. Whether you're a fresh graduate or an experienced professional, our resume builder adapts to your needs with flexible sections for education, experience, and skills."
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resume Editor</h2>
            <Button onClick={() => saveToLocalStorage(resumeData)} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Professional Title</label>
                  <Input
                    value={resumeData.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <Input
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">LinkedIn</label>
                  <Input
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Website/Portfolio</label>
                <Input
                  value={resumeData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="johndoe.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Professional Summary</label>
                <Textarea
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                  placeholder="Brief summary of your professional background and goals..."
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4 mt-4">
              <Button onClick={addExperience} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
              
              {resumeData.experience.map((exp, index) => (
                <Card key={exp.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Experience #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Company Name"
                    />
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                      placeholder="Position/Title"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      placeholder="Location"
                    />
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      placeholder="Start Date"
                    />
                    <Input
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-4">
              <Button onClick={addEducation} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
              
              {resumeData.education.map((edu, index) => (
                <Card key={edu.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Education #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="Institution Name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Degree (e.g., Bachelor's)"
                    />
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="Field of Study"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      placeholder="Start Date"
                    />
                    <Input
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                      placeholder="End Date"
                    />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-4">
              <Button onClick={addSkill} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                {resumeData.skills.map((skill) => (
                  <Card key={skill.id} className="p-3 flex items-center gap-3">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Preview
            </h2>
            <Button onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Resume Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div ref={resumeRef} className="p-8 text-gray-900 min-h-[800px]">
              {/* Header */}
              <div className="text-center mb-6 border-b pb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {resumeData.personalInfo.fullName || "Your Name"}
                </h1>
                <p className="text-lg text-cyan-600 mb-2">
                  {resumeData.personalInfo.title || "Professional Title"}
                </p>
                <div className="flex items-center justify-center flex-wrap gap-3 text-sm text-gray-600">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                </div>
                {(resumeData.personalInfo.linkedin || resumeData.personalInfo.website) && (
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600 mt-1">
                    {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                    {resumeData.personalInfo.website && <span>• {resumeData.personalInfo.website}</span>}
                  </div>
                )}
              </div>

              {/* Summary */}
              {resumeData.personalInfo.summary && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b pb-1">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                            <p className="text-sm text-cyan-600">{exp.company || "Company"}{exp.location && ` • ${exp.location}`}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate || "Start"} - {exp.endDate || "Present"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b pb-1">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.institution || "Institution"}</h3>
                          <p className="text-sm text-gray-600">
                            {edu.degree || "Degree"}{edu.field && ` in ${edu.field}`}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {edu.startDate || "Start"} - {edu.endDate || "End"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b pb-1">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      skill.name && (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {skill.name}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
