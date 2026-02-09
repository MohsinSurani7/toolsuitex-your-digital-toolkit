import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { getToolById } from "@/lib/tools-data";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { ProfilePhotoUpload, PhotoSettings, defaultPhotoSettings } from "@/components/ProfilePhotoUpload";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
  description: string;
}

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
  doi: string;
}

interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    linkedin: string;
    orcid: string;
  };
  photo: PhotoSettings;
  summary: string;
  education: Education[];
  publications: Publication[];
  skills: string[];
  languages: string[];
  awards: string[];
}

const tool = getToolById("cv-maker")!;

export default function CVMaker() {
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      linkedin: "",
      orcid: "",
    },
    photo: defaultPhotoSettings,
    summary: "",
    education: [],
    publications: [],
    skills: [],
    languages: [],
    awards: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newAward, setNewAward] = useState("");

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          field: "",
          startYear: "",
          endYear: "",
          grade: "",
          description: "",
        },
      ],
    });
  };

  const addPublication = () => {
    setCvData({
      ...cvData,
      publications: [
        ...cvData.publications,
        {
          id: Date.now().toString(),
          title: "",
          journal: "",
          year: "",
          doi: "",
        },
      ],
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setCvData({ ...cvData, languages: [...cvData.languages, newLanguage.trim()] });
      setNewLanguage("");
    }
  };

  const addAward = () => {
    if (newAward.trim()) {
      setCvData({ ...cvData, awards: [...cvData.awards, newAward.trim()] });
      setNewAward("");
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    let y = 20;

    pdf.setFontSize(24);
    pdf.text(cvData.personalInfo.fullName || "Your Name", 105, y, { align: "center" });
    y += 8;

    pdf.setFontSize(14);
    pdf.text(cvData.personalInfo.title || "Professional Title", 105, y, { align: "center" });
    y += 10;

    pdf.setFontSize(10);
    const contactInfo = [cvData.personalInfo.email, cvData.personalInfo.phone, cvData.personalInfo.address]
      .filter(Boolean)
      .join(" | ");
    pdf.text(contactInfo, 105, y, { align: "center" });
    y += 15;

    if (cvData.summary) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Professional Summary", 20, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const summaryLines = pdf.splitTextToSize(cvData.summary, 170);
      pdf.text(summaryLines, 20, y);
      y += summaryLines.length * 5 + 10;
    }

    if (cvData.education.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Education", 20, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      cvData.education.forEach((edu) => {
        pdf.text(`${edu.degree} in ${edu.field}`, 20, y);
        y += 5;
        pdf.text(`${edu.institution} (${edu.startYear} - ${edu.endYear})`, 20, y);
        y += 8;
      });
      y += 5;
    }

    if (cvData.publications.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Publications", 20, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      cvData.publications.forEach((pub) => {
        pdf.text(`${pub.title} - ${pub.journal} (${pub.year})`, 20, y);
        y += 6;
      });
      y += 5;
    }

    if (cvData.skills.length > 0) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills", 20, y);
      y += 7;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(cvData.skills.join(", "), 20, y);
      y += 10;
    }

    pdf.save("cv.pdf");
    toast.success("CV downloaded successfully!");
  };

  const seoContent = {
    description: "Create comprehensive academic CVs for researchers and professionals.",
    content: `<h3>Professional CV Creation</h3><p>Design detailed curriculum vitae with sections for education, publications, awards, and more. Perfect for academics and professionals.</p><h3>Key Features</h3><ul><li>Academic-focused format</li><li>Publication tracking</li><li>PDF export</li></ul>`,
    keywords: ["CV maker", "curriculum vitae", "academic CV", "professional CV", "resume builder"],
    faqs: [
      { question: "What's the difference between a CV and a resume?", answer: "A CV is a comprehensive document detailing your entire academic and professional history, while a resume is typically 1-2 pages focused on relevant experience." },
      { question: "How long should my CV be?", answer: "Unlike resumes, CVs can be multiple pages. Academic CVs often run 3-10+ pages depending on experience." },
    ],
    aboutTool: "The CV Maker helps create comprehensive curriculum vitae for academics and professionals with sections for education, publications, and achievements.",
  };

  return (
    <ToolLayout tool={tool} seoContent={seoContent}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfilePhotoUpload
                photoSettings={cvData.photo}
                onPhotoChange={(photo) => setCvData({ ...cvData, photo })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={cvData.personalInfo.fullName}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, fullName: e.target.value },
                      })
                    }
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={cvData.personalInfo.title}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, title: e.target.value },
                      })
                    }
                    placeholder="Professor of Computer Science"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={cvData.personalInfo.email}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, email: e.target.value },
                      })
                    }
                    placeholder="john@university.edu"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={cvData.personalInfo.phone}
                    onChange={(e) =>
                      setCvData({
                        ...cvData,
                        personalInfo: { ...cvData.personalInfo, phone: e.target.value },
                      })
                    }
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={cvData.personalInfo.address}
                  onChange={(e) =>
                    setCvData({
                      ...cvData,
                      personalInfo: { ...cvData.personalInfo, address: e.target.value },
                    })
                  }
                  placeholder="Department of CS, University Name"
                />
              </div>
              <div>
                <Label>Professional Summary</Label>
                <Textarea
                  value={cvData.summary}
                  onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                  placeholder="Describe your research interests and expertise..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button onClick={addEducation} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Education #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          education: cvData.education.filter((e) => e.id !== edu.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = cvData.education.map((ed) =>
                          ed.id === edu.id ? { ...ed, institution: e.target.value } : ed
                        );
                        setCvData({ ...cvData, education: updated });
                      }}
                    />
                    <Input
                      placeholder="Degree (PhD, MSc, etc.)"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = cvData.education.map((ed) =>
                          ed.id === edu.id ? { ...ed, degree: e.target.value } : ed
                        );
                        setCvData({ ...cvData, education: updated });
                      }}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => {
                        const updated = cvData.education.map((ed) =>
                          ed.id === edu.id ? { ...ed, field: e.target.value } : ed
                        );
                        setCvData({ ...cvData, education: updated });
                      }}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Start Year"
                        value={edu.startYear}
                        onChange={(e) => {
                          const updated = cvData.education.map((ed) =>
                            ed.id === edu.id ? { ...ed, startYear: e.target.value } : ed
                          );
                          setCvData({ ...cvData, education: updated });
                        }}
                      />
                      <Input
                        placeholder="End Year"
                        value={edu.endYear}
                        onChange={(e) => {
                          const updated = cvData.education.map((ed) =>
                            ed.id === edu.id ? { ...ed, endYear: e.target.value } : ed
                          );
                          setCvData({ ...cvData, education: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Publications</CardTitle>
              <Button onClick={addPublication} size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.publications.map((pub, index) => (
                <div key={pub.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Publication #{index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCvData({
                          ...cvData,
                          publications: cvData.publications.filter((p) => p.id !== pub.id),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Publication Title"
                    value={pub.title}
                    onChange={(e) => {
                      const updated = cvData.publications.map((p) =>
                        p.id === pub.id ? { ...p, title: e.target.value } : p
                      );
                      setCvData({ ...cvData, publications: updated });
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Journal/Conference"
                      value={pub.journal}
                      onChange={(e) => {
                        const updated = cvData.publications.map((p) =>
                          p.id === pub.id ? { ...p, journal: e.target.value } : p
                        );
                        setCvData({ ...cvData, publications: updated });
                      }}
                    />
                    <Input
                      placeholder="Year"
                      value={pub.year}
                      onChange={(e) => {
                        const updated = cvData.publications.map((p) =>
                          p.id === pub.id ? { ...p, year: e.target.value } : p
                        );
                        setCvData({ ...cvData, publications: updated });
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills & Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Skills</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cvData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() =>
                          setCvData({
                            ...cvData,
                            skills: cvData.skills.filter((_, idx) => idx !== i),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label>Languages</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    onKeyPress={(e) => e.key === "Enter" && addLanguage()}
                  />
                  <Button onClick={addLanguage}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cvData.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-secondary/50 rounded-full text-sm flex items-center gap-1"
                    >
                      {lang}
                      <button
                        onClick={() =>
                          setCvData({
                            ...cvData,
                            languages: cvData.languages.filter((_, idx) => idx !== i),
                          })
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={generatePDF} className="w-full" size="lg">
            <Download className="w-5 h-5 mr-2" />
            Download CV as PDF
          </Button>
        </div>

        {/* Preview Section - Professional Academic CV Design */}
        <div className="lg:sticky lg:top-8">
          <Card className="h-fit overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
              <CardTitle className="text-white">CV Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-white text-black min-h-[700px]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6">
                  <div className={`${cvData.photo.src ? 'flex gap-5 items-center' : 'text-center'}`}>
                    {cvData.photo.src && (
                      <div className={`flex-shrink-0 ${cvData.photo.alignment === 'right' ? 'order-last' : ''}`}>
                        <div 
                          className={`w-24 h-24 overflow-hidden border-4 border-white/30 shadow-lg ${cvData.photo.shape === 'circle' ? 'rounded-full' : cvData.photo.shape === 'rounded' ? 'rounded-xl' : ''}`}
                        >
                          <img
                            src={cvData.photo.src}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            style={{
                              transform: `scale(${cvData.photo.zoom / 100}) rotate(${cvData.photo.rotation}deg)`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className={cvData.photo.src ? 'flex-1' : ''}>
                      <h1 className="text-2xl font-bold tracking-wide">
                        {cvData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <p className="text-emerald-200 text-lg mt-1">{cvData.personalInfo.title || "Professional Title"}</p>
                      <div className={`flex flex-wrap gap-3 text-xs text-emerald-100 mt-3 ${!cvData.photo.src ? 'justify-center' : ''}`}>
                        {cvData.personalInfo.email && <span>✉ {cvData.personalInfo.email}</span>}
                        {cvData.personalInfo.phone && <span>☎ {cvData.personalInfo.phone}</span>}
                      </div>
                      {cvData.personalInfo.address && (
                        <p className={`text-xs text-emerald-100 mt-1 ${!cvData.photo.src ? 'text-center' : ''}`}>
                          📍 {cvData.personalInfo.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                  {cvData.summary && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Research Profile
                      </h2>
                      <p className="text-gray-700 text-xs leading-relaxed">{cvData.summary}</p>
                    </div>
                  )}

                  {cvData.education.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Education
                      </h2>
                      <div className="space-y-3">
                        {cvData.education.map((edu) => (
                          <div key={edu.id} className="flex gap-3">
                            <div className="w-1 bg-emerald-200 rounded-full flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">
                                {edu.degree} {edu.field && `in ${edu.field}`}
                              </p>
                              <p className="text-gray-600 text-xs">
                                {edu.institution}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {edu.startYear} — {edu.endYear}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvData.publications.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Publications
                      </h2>
                      <div className="space-y-2">
                        {cvData.publications.map((pub, index) => (
                          <div key={pub.id} className="flex gap-2 text-xs">
                            <span className="text-emerald-600 font-medium">[{index + 1}]</span>
                            <p className="text-gray-700">
                              <span className="font-medium">{pub.title}</span>
                              {pub.journal && <span className="italic"> — {pub.journal}</span>}
                              {pub.year && <span className="text-gray-500"> ({pub.year})</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvData.skills.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Technical Skills
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {cvData.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvData.languages.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Languages
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {cvData.languages.map((lang, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvData.awards.length > 0 && (
                    <div>
                      <h2 className="text-sm font-bold uppercase text-emerald-800 border-b-2 border-emerald-800 pb-1 mb-3 tracking-wider">
                        Honors & Awards
                      </h2>
                      <ul className="space-y-1">
                        {cvData.awards.map((award, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-emerald-600">★</span>
                            {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
