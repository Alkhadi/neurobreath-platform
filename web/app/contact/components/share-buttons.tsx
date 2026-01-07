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
  const [downloadingQR, setDownloadingQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Generate comprehensive vCard data
  const generateVCardData = () => {
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

  const profileData = generateVCardData();

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

      // Create a canvas to render the QR code with white background
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        alert("❌ Failed to create canvas.");
        setDownloadingQR(false);
        return;
      }

      const img = new Image();
      canvas.width = 512;
      canvas.height = 512;

      // Wait for image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // White background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 512, 512);
            // Draw QR code
            ctx.drawImage(img, 0, 0, 512, 512);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      });

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
        }, "image/png");
      });

      setTimeout(() => {
        alert("✅ QR code downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("QR download error:", error);
      alert("❌ Failed to download QR code. Please try again.");
    } finally {
      setDownloadingQR(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;
      
      // Get the profile card element
      const cardElement = document.getElementById("profile-card-capture");
      if (!cardElement) {
        alert("❌ Profile card not found. Please refresh the page.");
        return;
      }

      // Capture the card with high quality
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        allowTaint: true,
        foreignObjectRendering: false,
      });

      // Dynamically import jsPDF
      const { default: jsPDF } = await import("jspdf");
      
      // Create PDF with custom size to fit the card
      const imgWidth = 180; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [imgWidth + 30, imgHeight + 30],
      });

      // Add white background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, imgWidth + 30, imgHeight + 30, "F");

      // Add the captured image
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);

      // Add footer with contact info
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Generated by NBCard - ${new Date().toLocaleDateString()}`,
        (imgWidth + 30) / 2,
        imgHeight + 25,
        { align: "center" }
      );

      pdf.save(`${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard.pdf`);
      
      // Success feedback
      setTimeout(() => {
        alert("✅ PDF generated and downloaded successfully!");
      }, 100);
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("❌ Failed to generate PDF. Please try again. Error: " + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const exportVCard = () => {
    try {
      const blob = new Blob([profileData], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Success feedback
      setTimeout(() => {
        alert("✅ vCard downloaded successfully! Import it to your contacts app.");
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
      // Wait a bit for any pending renders
      await new Promise(resolve => setTimeout(resolve, 100));

      const html2canvas = (await import("html2canvas")).default;
      const cardElement = document.getElementById("profile-card-capture");
      if (!cardElement) {
        alert("❌ Profile card not found. Please refresh the page.");
        return;
      }

      // Capture with high quality settings
      const canvas = await html2canvas(cardElement, {
        scale: 3, // High resolution (3x for crisp images)
        useCORS: true,
        logging: false,
        backgroundColor: null,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      // Convert to blob and download
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            alert("❌ Failed to generate image");
            return;
          }
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${profile?.fullName?.replace(/\s+/g, "_") ?? "profile"}_NBCard.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          // Success feedback
          setTimeout(() => {
            alert("✅ Image downloaded successfully!");
          }, 100);
        },
        "image/png",
        1.0 // Maximum quality
      );
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
          onClick={() => setShowQR(!showQR)}
          className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105"
        >
          <FaQrcode className="text-2xl" />
          <span className="text-sm font-semibold">QR Code</span>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">QR Code</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div ref={qrRef} className="flex justify-center mb-4 p-4 bg-white rounded-lg">
              <QRCodeSVG value={profileData} size={256} level="H" includeMargin />
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              Scan this QR code to save contact details
            </p>
            <button
              onClick={downloadQR}
              disabled={downloadingQR}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload />
              {downloadingQR ? "Downloading..." : "Download QR Code"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

