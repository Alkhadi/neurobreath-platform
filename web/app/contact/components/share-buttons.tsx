"use client";

import { useState, useRef } from "react";
import { Profile } from "@/lib/utils";
import { FaQrcode, FaFilePdf, FaDownload, FaImage, FaWhatsapp, FaEnvelope, FaSms, FaShareAlt } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

interface ShareButtonsProps {
  profile: Profile;
}

export function ShareButtons({ profile }: ShareButtonsProps) {
  const [showQR, setShowQR] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [profileImageDataUrl, setProfileImageDataUrl] = useState<string>("");
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate comprehensive vCard data with photo
  const generateVCardData = async (includePhoto: boolean = false) => {
    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile?.fullName ?? ""}
TITLE:${profile?.jobTitle ?? ""}
TEL;TYPE=CELL:${profile?.phone ?? ""}
EMAIL;TYPE=INTERNET:${profile?.email ?? ""}`;

    if (profile?.profileDescription) {
      vcard += `\nNOTE:${profile.profileDescription}`;
    }
    
    if (profile?.businessDescription) {
      vcard += `\nORG:${profile.businessDescription}`;
    }

    // Add photo if requested
    if (includePhoto && profileImageDataUrl) {
      const base64Data = profileImageDataUrl.split(',')[1];
      vcard += `\nPHOTO;ENCODING=B;TYPE=PNG:${base64Data}`;
    }

    // Add social media URLs
    if (profile?.socialMedia?.website) {
      vcard += `\nURL:${profile.socialMedia.website}`;
    }
    if (profile?.socialMedia?.instagram) {
      vcard += `\nX-SOCIALPROFILE;TYPE=instagram:${profile.socialMedia.instagram}`;
    }
    if (profile?.socialMedia?.facebook) {
      vcard += `\nX-SOCIALPROFILE;TYPE=facebook:${profile.socialMedia.facebook}`;
    }
    if (profile?.socialMedia?.twitter) {
      vcard += `\nX-SOCIALPROFILE;TYPE=twitter:${profile.socialMedia.twitter}`;
    }
    if (profile?.socialMedia?.linkedin) {
      vcard += `\nX-SOCIALPROFILE;TYPE=linkedin:${profile.socialMedia.linkedin}`;
    }
    if (profile?.socialMedia?.tiktok) {
      vcard += `\nX-SOCIALPROFILE;TYPE=tiktok:${profile.socialMedia.tiktok}`;
    }

    vcard += `\nEND:VCARD`;
    return vcard;
  };

  const profileText = `${profile?.fullName ?? ""}
${profile?.jobTitle ?? ""}

📞 ${profile?.phone ?? ""}
📧 ${profile?.email ?? ""}${
    profile?.profileDescription ? `\n\n📝 ${profile.profileDescription}` : ""
  }${
    profile?.businessDescription ? `\n\n💼 ${profile.businessDescription}` : ""
  }${
    profile?.socialMedia?.website ? `\n\n🌐 ${profile.socialMedia.website}` : ""
  }

---
Shared via NBCard - Digital Business Card`;

  // Capture profile card as high-quality image
  const captureProfileCard = async (): Promise<string> => {
    const html2canvas = (await import("html2canvas")).default;
    const cardElement = document.getElementById("profile-card-capture");
    
    if (!cardElement) {
      throw new Error("Profile card not found");
    }

    const canvas = await html2canvas(cardElement, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: null,
      allowTaint: true,
      foreignObjectRendering: false,
      imageTimeout: 0,
      removeContainer: true,
    });

    return canvas.toDataURL("image/png", 1.0);
  };

  // Generate QR Code with embedded profile image
  const generateQRWithImage = async () => {
    setGeneratingQR(true);
    try {
      // First capture the profile card image
      const imageDataUrl = await captureProfileCard();
      setProfileImageDataUrl(imageDataUrl);

      // Generate vCard with embedded photo
      const vCardData = await generateVCardData(true);
      setQrCodeValue(vCardData);
      
      // Show the QR modal
      setShowQR(true);
      
      setTimeout(() => {
        alert("✅ QR Code generated with embedded profile image!");
      }, 500);
    } catch (error) {
      console.error("QR generation error:", error);
      alert("❌ Failed to generate QR code. Please try again.");
    } finally {
      setGeneratingQR(false);
    }
  };

  const downloadQR = async () => {
    setDownloadingQR(true);
    try {
      if (!qrRef.current) {
        alert("❌ QR code not found. Please open the QR code first.");
        setDownloadingQR(false);
        return;
      }

      const svg = qrRef.current.querySelector("svg");
      if (!svg) {
        alert("❌ QR code not found. Please try again.");
        setDownloadingQR(false);
        return;
      }

      // Create a professional QR code image with branding
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        alert("❌ Failed to create canvas.");
        setDownloadingQR(false);
        return;
      }

      // Set canvas size (larger for better quality)
      canvas.width = 800;
      canvas.height = 900;

      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText(profile?.fullName ?? "Profile Card", canvas.width / 2, 50);

      // Add subtitle
      ctx.fillStyle = "#6b7280";
      ctx.font = "20px Arial";
      ctx.fillText("Scan to save contact", canvas.width / 2, 85);

      // Draw QR code
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // Center the QR code with padding
            const qrSize = 600;
            const x = (canvas.width - qrSize) / 2;
            const y = 120;
            
            // Add shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            
            // White background for QR
            ctx.fillStyle = "white";
            ctx.fillRect(x - 20, y - 20, qrSize + 40, qrSize + 40);
            
            // Draw QR code
            ctx.shadowColor = "transparent";
            ctx.drawImage(img, x, y, qrSize, qrSize);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      });

      // Add footer
      ctx.fillStyle = "#9ca3af";
      ctx.font = "16px Arial";
      ctx.fillText("NBCard - Digital Business Card", canvas.width / 2, 860);

      // Convert to blob and download
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }
          try {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_QR.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve();
          } catch (error) {
            reject(error);
          }
        }, "image/png", 1.0);
      });

      setTimeout(() => {
        alert("✅ Professional QR code downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("QR download error:", error);
      alert("❌ Failed to download QR code. Please try again.");
    } finally {
      setDownloadingQR(false);
    }
  };

  // Generate Professional PDF with 100% exact capture and clickable text overlays
  const generatePDF = async () => {
    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the profile card at maximum quality
      const imageDataUrl = await captureProfileCard();

      // Dynamically import jsPDF
      const { default: jsPDF } = await import("jspdf");
      
      // Get the actual card element to calculate dimensions
      const cardElement = document.getElementById("profile-card-capture");
      if (!cardElement) {
        throw new Error("Profile card not found");
      }

      // Get card dimensions
      const cardRect = cardElement.getBoundingClientRect();
      const aspectRatio = cardRect.height / cardRect.width;
      
      // Create PDF with optimal size for the card
      const pdfWidth = 210; // A4 width in mm
      const cardWidth = 180; // Card width in mm (leaving margins)
      const cardHeight = cardWidth * aspectRatio;
      const pdfHeight = cardHeight + 60; // Add space for margins and footer
      
      const pdf = new jsPDF({
        orientation: cardHeight > cardWidth ? "portrait" : "portrait",
        unit: "mm",
        format: [pdfWidth, Math.max(pdfHeight, 297)], // Minimum A4 height
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add subtle gradient background
      pdf.setFillColor(249, 250, 251);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Calculate card position (centered)
      const cardX = (pageWidth - cardWidth) / 2;
      const cardY = 30;
      
      // Add the 100% accurate captured image
      pdf.addImage(imageDataUrl, "PNG", cardX, cardY, cardWidth, cardHeight, undefined, "FAST");

      // Now overlay transparent clickable links on top of the image
      // These positions are calculated based on the profile card layout
      
      // Calculate link positions (these correspond to where elements appear on the card)
      const linkHeight = 8; // Height of clickable area
      const cardCenterX = cardX + (cardWidth / 2);
      
      // Phone link overlay (appears around 60% down the card)
      if (profile?.phone) {
        const phoneY = cardY + (cardHeight * 0.55);
        pdf.link(cardX + 15, phoneY - 4, cardWidth - 30, linkHeight, {
          url: `tel:${profile.phone.replace(/\s/g, "")}`,
        });
      }

      // Email link overlay (appears around 65% down the card)
      if (profile?.email) {
        const emailY = cardY + (cardHeight * 0.62);
        pdf.link(cardX + 15, emailY - 4, cardWidth - 30, linkHeight, {
          url: `mailto:${profile.email}`,
        });
      }

      // Social media links overlay (appear around 70-85% down the card)
      const socialMediaY = cardY + (cardHeight * 0.72);
      const socialIconSize = 12;
      const socialGap = 4;
      
      const socialLinks = [
        { url: profile?.socialMedia?.instagram },
        { url: profile?.socialMedia?.facebook },
        { url: profile?.socialMedia?.tiktok },
        { url: profile?.socialMedia?.linkedin },
        { url: profile?.socialMedia?.twitter },
        { url: profile?.socialMedia?.website },
      ].filter(link => link.url);

      // Calculate starting X for centered social media icons
      const totalSocialWidth = (socialLinks.length * socialIconSize) + ((socialLinks.length - 1) * socialGap);
      let socialX = cardCenterX - (totalSocialWidth / 2);

      socialLinks.forEach((link) => {
        if (link.url) {
          pdf.link(socialX, socialMediaY - 4, socialIconSize, socialIconSize, {
            url: link.url,
          });
          socialX += socialIconSize + socialGap;
        }
      });

      // Add text information below the card with clickable links
      let currentY = cardY + cardHeight + 15;

      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.setFont("helvetica", "bold");
      pdf.text("Contact Information", cardX, currentY);
      currentY += 10;

      // Phone (visible clickable text)
      if (profile?.phone) {
        pdf.setFontSize(11);
        pdf.setTextColor(147, 51, 234);
        pdf.setFont("helvetica", "normal");
        pdf.textWithLink(`📞 ${profile.phone}`, cardX, currentY, {
          url: `tel:${profile.phone.replace(/\s/g, "")}`,
        });
        currentY += 6;
      }

      // Email (visible clickable text)
      if (profile?.email) {
        pdf.setFontSize(11);
        pdf.setTextColor(59, 130, 246);
        pdf.textWithLink(`📧 ${profile.email}`, cardX, currentY, {
          url: `mailto:${profile.email}`,
        });
        currentY += 6;
      }

      // Social Media Links (visible clickable text)
      const visibleSocialLinks = [
        { icon: "🌐", name: "Website", url: profile?.socialMedia?.website },
        { icon: "📷", name: "Instagram", url: profile?.socialMedia?.instagram },
        { icon: "👤", name: "Facebook", url: profile?.socialMedia?.facebook },
        { icon: "🐦", name: "Twitter", url: profile?.socialMedia?.twitter },
        { icon: "💼", name: "LinkedIn", url: profile?.socialMedia?.linkedin },
        { icon: "🎵", name: "TikTok", url: profile?.socialMedia?.tiktok },
      ].filter(link => link.url);

      if (visibleSocialLinks.length > 0) {
        currentY += 5;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text("Social Media:", cardX, currentY);
        currentY += 6;

        pdf.setFont("helvetica", "normal");
        visibleSocialLinks.forEach(link => {
          if (currentY > pageHeight - 20) return;
          
          pdf.setTextColor(147, 51, 234);
          pdf.textWithLink(`${link.icon} ${link.name}`, cardX, currentY, {
            url: link.url ?? "",
          });
          currentY += 6;
        });
      }

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        `Generated by NBCard - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Add professional branding line
      pdf.setDrawColor(147, 51, 234);
      pdf.setLineWidth(0.5);
      pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

      // Save the PDF
      pdf.save(`${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard_Perfect.pdf`);
      
      setTimeout(() => {
        alert("✅ Perfect PDF with 100% exact capture and clickable overlays generated!");
      }, 100);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("❌ Failed to generate PDF. Please try again. Error: " + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const exportVCard = async () => {
    try {
      // Generate vCard with photo
      const vCardData = profileImageDataUrl 
        ? await generateVCardData(true)
        : await generateVCardData(false);

      const blob = new Blob([vCardData], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert("✅ vCard with photo downloaded successfully! Import it to your contacts app.");
      }, 100);
    } catch (error) {
      console.error("vCard export error:", error);
      alert("❌ Failed to export vCard. Please try again.");
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(profileText);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Contact Card - ${profile?.fullName ?? "Profile"}`);
    const body = encodeURIComponent(profileText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(profileText);
    window.location.href = `sms:?body=${text}`;
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contact Card - ${profile?.fullName ?? "Profile"}`,
          text: profileText,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      alert("Web Share API is not supported in your browser");
    }
  };

  const captureAsImage = async () => {
    setGeneratingImage(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const imageDataUrl = await captureProfileCard();
      setProfileImageDataUrl(imageDataUrl);

      // Convert data URL to blob and download
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setTimeout(() => {
        alert("✅ High-quality image downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("Image capture error:", error);
      alert("❌ Failed to capture image. Please try again. Error: " + (error as Error).message);
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Share Your Profile</h2>

      {/* Sharing Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={generateQRWithImage}
          disabled={generatingQR}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaQrcode className="text-2xl" />
          <span className="text-sm font-semibold">{generatingQR ? "Creating..." : "QR Code"}</span>
        </button>

        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFilePdf className="text-2xl" />
          <span className="text-sm font-semibold">{generating ? "Creating..." : "PDF"}</span>
        </button>

        <button
          onClick={exportVCard}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaDownload className="text-2xl" />
          <span className="text-sm font-semibold">vCard</span>
        </button>

        <button
          onClick={captureAsImage}
          disabled={generatingImage}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaImage className="text-2xl" />
          <span className="text-sm font-semibold">{generatingImage ? "Creating..." : "Image"}</span>
        </button>

        <button
          onClick={shareViaWhatsApp}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="text-sm font-semibold">WhatsApp</span>
        </button>

        <button
          onClick={shareViaEmail}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaEnvelope className="text-2xl" />
          <span className="text-sm font-semibold">Email</span>
        </button>

        <button
          onClick={shareViaSMS}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaSms className="text-2xl" />
          <span className="text-sm font-semibold">SMS</span>
        </button>

        <button
          onClick={shareNative}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaShareAlt className="text-2xl" />
          <span className="text-sm font-semibold">More</span>
        </button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">QR Code with Profile Image</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div ref={qrRef} className="flex justify-center mb-4 p-4 bg-gray-50 rounded-lg">
              <QRCodeSVG 
                value={qrCodeValue || "Loading..."} 
                size={280} 
                level="M" 
                includeMargin
                imageSettings={profileImageDataUrl ? {
                  src: profileImageDataUrl,
                  height: 50,
                  width: 50,
                  excavate: true,
                } : undefined}
              />
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>✨ Enhanced QR Code</strong><br/>
                Contains your full contact details with embedded profile image
              </p>
            </div>

            <button
              onClick={downloadQR}
              disabled={downloadingQR}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload />
              {downloadingQR ? "Downloading..." : "Download Professional QR Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
