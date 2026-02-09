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
import { ProfilePhotoUpload, PhotoSettings, defaultPhotoSettings } from "@/components/ProfilePhotoUpload";

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
  photo: PhotoSettings;
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
  photo: defaultPhotoSettings,
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
              <ProfilePhotoUpload
                photoSettings={resumeData.photo}
                onPhotoChange={(photo) => setResumeData(prev => ({ ...prev, photo }))}
              />
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

          {/* Resume Preview - Professional Design */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <div ref={resumeRef} className="min-h-[900px]" style={{ fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
              {/* Professional Header with Accent Bar */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8">
                <div className={`${resumeData.photo.src ? 'flex gap-6 items-center' : 'text-center'}`}>
                  {resumeData.photo.src && (
                    <div className={`flex-shrink-0 ${resumeData.photo.alignment === 'right' ? 'order-last' : ''}`}>
                      <div 
                        className={`w-28 h-28 overflow-hidden border-4 border-white/30 shadow-lg ${resumeData.photo.shape === 'circle' ? 'rounded-full' : resumeData.photo.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`}
                      >
                        <img
                          src={resumeData.photo.src}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scale(${resumeData.photo.zoom / 100}) rotate(${resumeData.photo.rotation}deg)`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className={`${resumeData.photo.src ? 'flex-1' : ''}`}>
                    <h1 className="text-3xl font-bold tracking-wide mb-1">
                      {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <p className="text-xl text-cyan-300 font-medium mb-3">
                      {resumeData.personalInfo.title || "Professional Title"}
                    </p>
                    <div className={`flex flex-wrap gap-4 text-sm text-gray-300 ${!resumeData.photo.src ? 'justify-center' : ''}`}>
                      {resumeData.personalInfo.email && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {resumeData.personalInfo.email}
                        </span>
                      )}
                      {resumeData.personalInfo.phone && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {resumeData.personalInfo.phone}
                        </span>
                      )}
                      {resumeData.personalInfo.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {resumeData.personalInfo.location}
                        </span>
                      )}
                    </div>
                    {(resumeData.personalInfo.linkedin || resumeData.personalInfo.website) && (
                      <div className={`flex gap-4 text-sm text-gray-300 mt-2 ${!resumeData.photo.src ? 'justify-center' : ''}`}>
                        {resumeData.personalInfo.linkedin && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            {resumeData.personalInfo.linkedin}
                          </span>
                        )}
                        {resumeData.personalInfo.website && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                            {resumeData.personalInfo.website}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 text-gray-800">
                {/* Summary */}
                {resumeData.personalInfo.summary && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-8 h-1 bg-cyan-500 rounded"></div>
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-600 leading-relaxed pl-10">
                      {resumeData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-1 bg-cyan-500 rounded"></div>
                      WORK EXPERIENCE
                    </h2>
                    <div className="space-y-5 pl-10">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="relative">
                          <div className="absolute -left-6 top-2 w-3 h-3 bg-cyan-500 rounded-full"></div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-bold text-gray-900">{exp.position || "Position"}</h3>
                              <p className="text-cyan-600 font-medium">{exp.company || "Company"}{exp.location && ` · ${exp.location}`}</p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                              {exp.startDate || "Start"} — {exp.endDate || "Present"}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-1 bg-cyan-500 rounded"></div>
                      EDUCATION
                    </h2>
                    <div className="space-y-4 pl-10">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="relative">
                          <div className="absolute -left-6 top-2 w-3 h-3 bg-slate-400 rounded-full"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-900">{edu.institution || "Institution"}</h3>
                              <p className="text-gray-600">
                                {edu.degree || "Degree"}{edu.field && ` in ${edu.field}`}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                              {edu.startDate || "Start"} — {edu.endDate || "End"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resumeData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-1 bg-cyan-500 rounded"></div>
                      SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-10">
                      {resumeData.skills.map((skill) => (
                        skill.name && (
                          <span
                            key={skill.id}
                            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium border border-slate-200"
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
      </div>
    </ToolLayout>
  );
}
