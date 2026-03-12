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
import { DesignCustomizer } from "@/components/design/DesignCustomizer";
import { DesignSettings, DesignTheme, resumeThemes, getHeaderBackground } from "@/components/design/designData";

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
  personalInfo: { fullName: "", email: "", phone: "", location: "", title: "", summary: "", linkedin: "", website: "" },
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
  const [selectedThemeId, setSelectedThemeId] = useState(resumeThemes[0].id);
  const [design, setDesign] = useState<DesignSettings>(resumeThemes[0].settings);
  const [textColors, setTextColors] = useState({ name: "", title: "", contact: "", sectionHeading: "" });

  const handleThemeSelect = (theme: DesignTheme) => {
    setSelectedThemeId(theme.id);
    setDesign(theme.settings);
    setTextColors({ name: "", title: "", contact: "", sectionHeading: "" });
  };

  const saveToLocalStorage = (data: ResumeData) => {
    localStorage.setItem("toolsuitex-resume", JSON.stringify(data));
    toast.success("Resume saved!");
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const addEducation = () => {
    setResumeData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), institution: "", degree: "", field: "", startDate: "", endDate: "", description: "" }] }));
  };
  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu) }));
  };
  const removeEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addExperience = () => {
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", description: "" }] }));
  };
  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp) }));
  };
  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addSkill = () => {
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, { id: Date.now().toString(), name: "", level: 50 }] }));
  };
  const updateSkill = (id: string, field: string, value: string | number) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill) }));
  };
  const removeSkill = (id: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill.id !== id) }));
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    toast.info("Generating PDF...");
    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true, backgroundColor: design.bodyBg });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${resumeData.personalInfo.fullName || "resume"}-resume.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
    }
  };

  const sectionColor = textColors.sectionHeading || design.accentColor;

  const seoContent = {
    description: "Create professional, ATS-friendly resumes with 12+ themes, 500+ colors, gradient presets, and individual text color controls. Free online resume builder.",
    content: `<h3>How to Create a Professional Resume</h3><p>Creating a standout resume is crucial. Our builder offers 12+ themes, 500+ color palette, gradient headers, and individual text color controls for maximum customization.</p><h4>Key Features</h4><ul><li>12+ professional themes including Glassmorphism, Brutalist, Neon Glow</li><li>500+ color palette with gradient presets</li><li>Individual text color controls</li><li>ATS-friendly formatting</li><li>PDF export</li></ul>`,
    keywords: ["Free Online Resume Maker", "ATS-Friendly CV", "Professional Resume Builder", "Resume Templates 2024", "CV Builder Online"],
    faqs: [
      { question: "Is this resume builder completely free?", answer: "Yes! 100% free with no hidden fees." },
      { question: "Is my resume data secure?", answer: "All data is stored locally in your browser. We never upload your information." },
      { question: "Can I customize the design?", answer: "Yes! Choose from 12+ themes, 500+ colors, 24 gradient presets, and set individual text colors." },
    ],
    aboutTool: "The Resume Builder creates professional, ATS-optimized resumes with 12+ themes, full color customization, and PDF export.",
  };

  const textColorFields = [
    { key: "name", label: "Name", value: textColors.name, onChange: (c: string) => setTextColors(p => ({ ...p, name: c })) },
    { key: "title", label: "Title", value: textColors.title, onChange: (c: string) => setTextColors(p => ({ ...p, title: c })) },
    { key: "contact", label: "Contact", value: textColors.contact, onChange: (c: string) => setTextColors(p => ({ ...p, contact: c })) },
    { key: "sectionHeading", label: "Sections", value: textColors.sectionHeading, onChange: (c: string) => setTextColors(p => ({ ...p, sectionHeading: c })) },
  ];

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      {/* Design Customizer */}
      <div className="mb-6">
        <DesignCustomizer
          themes={resumeThemes}
          settings={design}
          selectedThemeId={selectedThemeId}
          onThemeSelect={handleThemeSelect}
          onSettingsChange={setDesign}
          textColorFields={textColorFields}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resume Editor</h2>
            <Button onClick={() => saveToLocalStorage(resumeData)} size="sm">
              <Save className="w-4 h-4 mr-2" /> Save
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
              <ProfilePhotoUpload photoSettings={resumeData.photo} onPhotoChange={(photo) => setResumeData(prev => ({ ...prev, photo }))} />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Full Name</label><Input value={resumeData.personalInfo.fullName} onChange={(e) => updatePersonalInfo("fullName", e.target.value)} placeholder="John Doe" /></div>
                <div><label className="text-sm font-medium mb-1 block">Professional Title</label><Input value={resumeData.personalInfo.title} onChange={(e) => updatePersonalInfo("title", e.target.value)} placeholder="Software Engineer" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Email</label><Input type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} placeholder="john@example.com" /></div>
                <div><label className="text-sm font-medium mb-1 block">Phone</label><Input value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} placeholder="+1 234 567 890" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Location</label><Input value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} placeholder="New York, NY" /></div>
                <div><label className="text-sm font-medium mb-1 block">LinkedIn</label><Input value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} placeholder="linkedin.com/in/johndoe" /></div>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Website/Portfolio</label><Input value={resumeData.personalInfo.website} onChange={(e) => updatePersonalInfo("website", e.target.value)} placeholder="johndoe.com" /></div>
              <div><label className="text-sm font-medium mb-1 block">Professional Summary</label><Textarea value={resumeData.personalInfo.summary} onChange={(e) => updatePersonalInfo("summary", e.target.value)} placeholder="Brief summary..." rows={4} /></div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4 mt-4">
              <Button onClick={addExperience} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Experience</Button>
              {resumeData.experience.map((exp, index) => (
                <Card key={exp.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Experience #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeExperience(exp.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="Company Name" />
                    <Input value={exp.position} onChange={(e) => updateExperience(exp.id, "position", e.target.value)} placeholder="Position/Title" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Input value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} placeholder="Location" />
                    <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="Start Date" />
                    <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="End Date" />
                  </div>
                  <Textarea value={exp.description} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} placeholder="Describe your responsibilities..." rows={3} />
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4 mt-4">
              <Button onClick={addEducation} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Education</Button>
              {resumeData.education.map((edu, index) => (
                <Card key={edu.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Education #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                  <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="Institution Name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="Degree" />
                    <Input value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Field of Study" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="Start Date" />
                    <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder="End Date" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4 mt-4">
              <Button onClick={addSkill} variant="outline" className="w-full"><Plus className="w-4 h-4 mr-2" /> Add Skill</Button>
              <div className="grid grid-cols-2 gap-3">
                {resumeData.skills.map((skill) => (
                  <Card key={skill.id} className="p-3 flex items-center gap-3">
                    <Input value={skill.name} onChange={(e) => updateSkill(skill.id, "name", e.target.value)} placeholder="Skill name" className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => removeSkill(skill.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Eye className="w-5 h-5" /> Preview</h2>
            <Button onClick={downloadPDF}><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
          </div>

          <div className="rounded-lg shadow-2xl overflow-hidden border" style={{ borderColor: design.borderColor }}>
            <div ref={resumeRef} className="min-h-[900px]" style={{ fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", background: design.bodyBg }}>
              {/* Header */}
              <div style={{ background: getHeaderBackground(design), color: design.headerText }} className="p-8">
                <div className={`${resumeData.photo.src ? 'flex gap-6 items-center' : 'text-center'}`}>
                  {resumeData.photo.src && (
                    <div className={`flex-shrink-0 ${resumeData.photo.alignment === 'right' ? 'order-last' : ''}`}>
                      <div className={`w-28 h-28 overflow-hidden border-4 shadow-lg ${resumeData.photo.shape === 'circle' ? 'rounded-full' : resumeData.photo.shape === 'rounded' ? 'rounded-xl' : 'rounded-none'}`} style={{ borderColor: design.headerAccent + "50" }}>
                        <img src={resumeData.photo.src} alt={`${resumeData.personalInfo.fullName || "Applicant"} profile photo`} className="w-full h-full object-cover" style={{ transform: `scale(${resumeData.photo.zoom / 100}) rotate(${resumeData.photo.rotation}deg)` }} />
                      </div>
                    </div>
                  )}
                  <div className={`${resumeData.photo.src ? 'flex-1' : ''}`}>
                    <h2 className="text-3xl font-bold tracking-wide mb-1" style={{ color: textColors.name || design.headerText }}>
                      {resumeData.personalInfo.fullName || "Your Name"}
                    </h2>
                    <p className="text-xl font-medium mb-3" style={{ color: textColors.title || design.headerAccent }}>
                      {resumeData.personalInfo.title || "Professional Title"}
                    </p>
                    <div className={`flex flex-wrap gap-4 text-sm ${!resumeData.photo.src ? 'justify-center' : ''}`} style={{ color: textColors.contact || design.headerText + "cc" }}>
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
                      <div className={`flex gap-4 text-sm mt-2 ${!resumeData.photo.src ? 'justify-center' : ''}`} style={{ color: textColors.contact || design.headerText + "cc" }}>
                        {resumeData.personalInfo.linkedin && <span className="flex items-center gap-1">🔗 {resumeData.personalInfo.linkedin}</span>}
                        {resumeData.personalInfo.website && <span className="flex items-center gap-1">🌐 {resumeData.personalInfo.website}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8" style={{ color: design.bodyText }}>
                {resumeData.personalInfo.summary && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: sectionColor }}>
                      <div className="w-8 h-1 rounded" style={{ background: sectionColor }}></div>
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="leading-relaxed pl-10" style={{ color: design.mutedText }}>{resumeData.personalInfo.summary}</p>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: sectionColor }}>
                      <div className="w-8 h-1 rounded" style={{ background: sectionColor }}></div>
                      WORK EXPERIENCE
                    </h2>
                    <div className="space-y-5 pl-10">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="relative">
                          <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{ background: design.accentColor }}></div>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-bold" style={{ color: design.bodyText }}>{exp.position || "Position"}</h3>
                              <p className="font-medium" style={{ color: design.accentColor }}>{exp.company || "Company"}{exp.location && ` · ${exp.location}`}</p>
                            </div>
                            <span className="text-sm px-3 py-1 rounded-full whitespace-nowrap" style={{ background: design.borderColor + "40", color: design.mutedText }}>
                              {exp.startDate || "Start"} — {exp.endDate || "Present"}
                            </span>
                          </div>
                          {exp.description && <p className="text-sm mt-2 leading-relaxed" style={{ color: design.mutedText }}>{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: sectionColor }}>
                      <div className="w-8 h-1 rounded" style={{ background: sectionColor }}></div>
                      EDUCATION
                    </h2>
                    <div className="space-y-4 pl-10">
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="relative">
                          <div className="absolute -left-6 top-2 w-3 h-3 rounded-full" style={{ background: design.mutedText }}></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">{edu.institution || "Institution"}</h3>
                              <p style={{ color: design.mutedText }}>{edu.degree || "Degree"}{edu.field && ` in ${edu.field}`}</p>
                            </div>
                            <span className="text-sm px-3 py-1 rounded-full whitespace-nowrap" style={{ background: design.borderColor + "40", color: design.mutedText }}>
                              {edu.startDate || "Start"} — {edu.endDate || "End"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: sectionColor }}>
                      <div className="w-8 h-1 rounded" style={{ background: sectionColor }}></div>
                      SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2 pl-10">
                      {resumeData.skills.map((skill) => (
                        skill.name && (
                          <span key={skill.id} className="px-4 py-2 text-sm rounded-lg font-medium border" style={{ background: design.accentColor + "15", color: design.accentColor, borderColor: design.accentColor + "30" }}>
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
