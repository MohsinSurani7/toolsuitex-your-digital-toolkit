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

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>CV Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-8 rounded-lg min-h-[600px] text-sm">
                <div className={`border-b pb-4 mb-4 ${cvData.photo.src ? 'flex gap-4' : 'text-center'}`}>
                  {cvData.photo.src && (
                    <div className={`flex-shrink-0 ${cvData.photo.alignment === 'right' ? 'order-last' : ''}`}>
                      <div 
                        className={`w-20 h-20 overflow-hidden ${cvData.photo.shape === 'circle' ? 'rounded-full' : cvData.photo.shape === 'rounded' ? 'rounded-lg' : ''}`}
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
                    <h1 className="text-2xl font-bold">
                      {cvData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <p className="text-gray-600">{cvData.personalInfo.title || "Professional Title"}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {[cvData.personalInfo.email, cvData.personalInfo.phone]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>
                </div>

                {cvData.summary && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm uppercase border-b mb-2">Summary</h2>
                    <p className="text-gray-700 text-xs">{cvData.summary}</p>
                  </div>
                )}

                {cvData.education.length > 0 && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm uppercase border-b mb-2">Education</h2>
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="mb-2">
                        <p className="font-semibold text-xs">
                          {edu.degree} in {edu.field}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {edu.institution} ({edu.startYear} - {edu.endYear})
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {cvData.publications.length > 0 && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm uppercase border-b mb-2">Publications</h2>
                    {cvData.publications.map((pub) => (
                      <p key={pub.id} className="text-xs text-gray-700 mb-1">
                        • {pub.title} - {pub.journal} ({pub.year})
                      </p>
                    ))}
                  </div>
                )}

                {cvData.skills.length > 0 && (
                  <div className="mb-4">
                    <h2 className="font-bold text-sm uppercase border-b mb-2">Skills</h2>
                    <p className="text-xs text-gray-700">{cvData.skills.join(", ")}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
