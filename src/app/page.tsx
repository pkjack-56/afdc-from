"use client";

import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

export default function UnitSelector() {
  const [date, setDate] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  // จำนวนหน่วยในใบเดียว + ข้อมูลหลักแต่ละหน่วย
  const [unitsCount, setUnitsCount] = useState<1 | 2 | 3>(1);
  const [mainDepts, setMainDepts] = useState<string[]>([""]);
  const [subDepts, setSubDepts] = useState<string[]>([""]);
  const [unitMessages, setUnitMessages] = useState<string[]>([""]);
  const [officeRegion, setOfficeRegion] = useState("1"); // เริ่มที่ภาค 2 เป็นค่า default
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [fontSizes, setFontSizes] = useState<number[]>([]);


  useEffect(() => {
    setMainDepts((prev) => {
      const next = [...prev];
      while (next.length < unitsCount) next.push("");
      next.length = unitsCount;
      return next;
    });
    setSubDepts((prev) => {
      const next = [...prev];
      while (next.length < unitsCount) next.push("");
      next.length = unitsCount;
      return next;
    });
    setUnitMessages((prev) => {
      const next = [...prev];
      while (next.length < unitsCount) next.push("");
      next.length = unitsCount;
      return next;
    });
  }, [unitsCount]);

  const subDeptOptions: { [key: string]: string[] } = {
    "ศจส.บก.สนภ.1 นทพ.": [
      "ศจส.นพค11 สนภ.1 นทพ.",
      "ศจส.นพค12 สนภ.1 นทพ.",
      "ศจส.นพค13 สนภ.1 นทพ.",
      "ศจส.นพค14 สนภ.1 นทพ.",
      "ศจส.นพค15 สนภ.1 นทพ.",
      "ศจส.นพค16 สนภ.1 นทพ.",
      "ศจส.วส.934 สนภ.1 นทพ.",
    ],
    "ศจส.บก.สนภ.2 นทพ.": [
      "ศจส.นพค21 สนภ.2 นทพ.",
      "ศจส.นพค22 สนภ.2 นทพ.",
      "ศจส.นพค23 สนภ.2 นทพ.",
      "ศจส.นพค24 สนภ.2 นทพ.",
      "ศจส.นพค25 สนภ.2 นทพ.",
      "ศจส.นพค26 สนภ.2 นทพ.",
      "ศจส.วส.909 สนภ.2 นทพ.",
    ],
    "ศจส.บก.สนภ.3 นทพ.": [
      "ศจส.นพค31 สนภ.3 นทพ.",
      "ศจส.นพค32 สนภ.3 นทพ.",
      "ศจส.นพค33 สนภ.3 นทพ.",
      "ศจส.นพค34 สนภ.3 นทพ.",
      "ศจส.นพค35 สนภ.3 นทพ.",
      "ศจส.นพค36 สนภ.3 นทพ.",
      "ศจส.วส.914 สนภ.3 นทพ.",
    ],
    "ศจส.บก.สนภ.4 นทพ.": [
      "ศจส.นพค41 สนภ.4 นทพ.",
      "ศจส.นพค42 สนภ.4 นทพ.",
      "ศจส.นพค43 สนภ.4 นทพ.",
      "ศจส.นพค44 สนภ.4 นทพ.",
      "ศจส.นพค45 สนภ.4 นทพ.",
      "ศจส.นพค46 สนภ.4 นทพ.",
      "ศจส.วส.912 สนภ.4 นทพ.",
    ],
    "ศจส.บก.สนภ.5 นทพ.": [
      "ศจส.นพค51 สนภ.5 นทพ.",
      "ศจส.นพค52 สนภ.5 นทพ.",
      "ศจส.นพค53 สนภ.5 นทพ.",
      "ศจส.นพค54 สนภ.5 นทพ.",
      "ศจส.นพค55 สนภ.5 นทพ.",
      "ศจส.นพค56 สนภ.5 นทพ.",
      "ศจส.วส.921 สนภ.5 นทพ.",
    ],
    "ศจส.นกส. สทพ.นทพ.": [
      "ศจส.นกส.1 สทพ.นทพ.",
      "ศจส.นกส.2 สทพ.นทพ.",
      "ศจส.นกส.3 สทพ.นทพ.",
      "ศจส.นกส.4 สทพ.นทพ.",
      "ศจส.นกส.5 สทพ.นทพ.",
    ],
    เพิ่มเติม: [
      "ศจส.สทพ.นทพ.",
      "ศจส.กกส.สทพ.นทพ.",
      "ศจส.กสข.สทพ.นทพ.",
      "ศจส.สสน.นทพ.",
      "ศจส.สนร.นทพ.",
      "ศจส.นพศ.นทพ.",
      "ศจส.ศฝภ.นทพ.",
    ],
  };

  // ---- อัปโหลด/ลบรูป ----
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 6) {
      alert("อัปโหลดได้สูงสุด 6 รูป");
      return;
    }
    const newFiles = [...images, ...files];
    const newUrls = [...imageUrls, ...files.map((f) => URL.createObjectURL(f))];
    setImages(newFiles);
    setImageUrls(newUrls);
  };
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  // ---- รอรูปโหลดก่อนแคป ----
  const waitForImagesLoad = async (root: HTMLElement) => {
    const imgs = Array.from(root.querySelectorAll("img"));
    await Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) return resolve();
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
      )
    );
  };

  // ---- แบ่งรูปต่อหน่วยตามรูปแบบ ----
  const getImagesForUnit = (unitIndex: number): string[] => {
    if (unitsCount === 1) return imageUrls;
    if (unitsCount === 2) {
      if (unitIndex === 0) return imageUrls.slice(0, 4);
      if (unitIndex === 1) return imageUrls.slice(4, 6);
    }
    const start = unitIndex * 2; // 3 หน่วย ๆ ละ 2 รูป
    return imageUrls.slice(start, start + 2);
  };

  // ---- ยืนยัน: เติมชื่อหน่วยย่อยในข้อความถ้าว่าง ----
  const handleSubmit = () => {
    setUnitMessages((prev) =>
      prev.map((txt, i) => {
        if (txt && txt.trim().length > 0) return txt;
        const unitTitle = (subDepts[i] || "").trim() || `หน่วยที่ ${i + 1}`;
        return `${unitTitle}\n`;
      })
    );
    setSubmitted(true);
  };
  useEffect(() => {
  if (!submitted || unitsCount === 1) return;

  const maxHeightEm = 12; // 3 บรรทัดที่ line-height 1.5em (1.5 * 3)
  const baseFontSize = 18;

  const newSizes = textRefs.current.map((el) => {
    if (!el) return baseFontSize;
    const emInPx = parseFloat(getComputedStyle(el).fontSize); // เช่น 18px
    const lineHeightPx = emInPx * 1.5;
    const maxHeightPx = lineHeightPx * 3;

    if (el.scrollHeight > maxHeightPx) {
      return 15; // ปรับลดลง
    }
    return baseFontSize;
  });

  setFontSizes(newSizes);
}, [submitted, unitMessages, unitsCount]);


  // ---- ดาวน์โหลด: คงสัดส่วน A4 เต็ม ----
  const handleDownload = async () => {
    if (!captureRef.current) return;
    // คำนวน scale ให้ผลลัพธ์กว้าง 2480px เสมอ แม้ preview จะถูกย่อ
    const desiredWidth = 2480;
    const el = captureRef.current;
    await waitForImagesLoad(el);
    const currentWidth = el.clientWidth; // ความกว้างตอน preview (เช่น ~794px)
    const scaleFactor = desiredWidth / currentWidth;

    const canvas = await html2canvas(el, {
      useCORS: true,
      scale: scaleFactor,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = "summary_a4.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };


  // ---- คำแนะนำจำนวนรูป ----
  const renderImagesHint = () => {
    if (unitsCount === 1) return "คำแนะนำ: ใช้ได้สูงสุด 6 รูป";
    if (unitsCount === 2) return "คำแนะนำ: หน่วยที่ 1 = 4 รูป, หน่วยที่ 2 = 2 รูป (รวม 6)";
    return "คำแนะนำ: หน่วยละ 2 รูป (รวม 6)";
  };

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto text-black bg-white">
      <h1 className="text-4xl font-bold mb-4">ฟอร์มส่งข้อมูล</h1>

      <div>
  <label className="block text-lg font-medium mb-1">สำนักงานพัฒนาภาค</label>
  <select
    value={officeRegion}
    onChange={(e) => setOfficeRegion(e.target.value)}
    className="border border-blue-500 p-2 w-full rounded"
  >
    <option value="1">สำนักงานพัฒนาภาค 1</option>
    <option value="2">สำนักงานพัฒนาภาค 2</option>
    <option value="3">สำนักงานพัฒนาภาค 3</option>
    <option value="4">สำนักงานพัฒนาภาค 4</option>
    <option value="5">สำนักงานพัฒนาภาค 5</option>
  </select>
</div>


      {/* เลือกจำนวนหน่วยในใบเดียว */}
      <div className="mt-1">
        <label className="block text-lg font-medium mb-2">จำนวนหน่วยในใบเดียว</label>
        <div className="flex gap-6">
          {[1, 2, 3].map((n) => (
            <label key={n} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="unitsCount"
                value={n}
                checked={unitsCount === (n as 1 | 2 | 3)}
                onChange={() => setUnitsCount(n as 1 | 2 | 3)}
              />
              <span>{n} หน่วย</span>
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-1">{renderImagesHint()}</p>
      </div>

      {/* กรอกข้อมูลแยกต่อหน่วย */}
      <div className="space-y-3">
        {Array.from({ length: unitsCount }, (_, i) => (
          <div key={`unit-${i}`} className="rounded border p-3">
            

            {/* ข้อความของหน่วย (ยังคงมีชื่อหน่วยย่อยอัตโนมัติถ้าไม่พิมพ์เอง) */}
            <label className="block text-lg font-medium mt-3 mb-1">ข้อความของหน่วยที่ {i + 1}</label>
            <textarea
              placeholder={`พิมพ์ข้อความของหน่วยที่ ${i + 1}`}
              value={unitMessages[i] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setUnitMessages((prev) => {
                  const next = [...prev];
                  next[i] = v;
                  return next;
                });
              }}
              className="border border-gray-400 p-2 w-full rounded"
              rows={4}
            />

            {/* พรีวิวรูปที่จะใช้กับหน่วยนี้ */}
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">รูปที่จะใช้กับหน่วยนี้:</div>
              <div className={`grid ${getImagesForUnit(i).length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                {getImagesForUnit(i).map((url, idx) => (
                  <img key={`pre-${i}-${idx}`} src={url} alt="" className="w-full h-32 object-cover rounded border" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* เลือกรูปภาพรวม */}
      <div>
        <label htmlFor="image-upload" className="inline-block bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          เลือกรูปภาพ
        </label>
        <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
        <p className="text-sm text-gray-600 mt-1">อัปโหลดได้สูงสุด 6 รูป</p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt="" className="w-full h-32 object-cover rounded border" />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* วันที่ */}
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-400 p-2 w-full rounded" />

      {/* ปุ่มยืนยัน */}
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
        ยืนยัน
      </button>

      {/* ================== PREVIEW A4 (ย่อให้พอดีจอ) + DOWNLOAD ================== */}
      {submitted && (
        <div className="mt-6 space-y-3">
          <div
            ref={captureRef}
            className="mx-auto border shadow bg-white"
            style={{
              // ย่อ preview ให้กว้าง ~794px (พอดีจอ) แต่ยังคงสัดส่วน A4
              width: "794px",
              aspectRatio: "auto 1 / 1.4142", // A4 ratio (210mm x 297mm)
              padding: "24px",
              boxSizing: "border-box",
              color: "rgb(17,24,39)",
              fontFamily: 'TH SarabunPSK',
            }}
          >
            {/* ===== HEADER (กรอบบน) ===== */}
            <div
              style={{
                border: "4px solid rgb(30,58,138)", // blue-900
                borderRadius: "17px",
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px",
                
              }}
            >
              <img src="/images/image.png" alt="" style={{ width: "95px", height: "65px", objectFit: "contain" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "rgba(0, 30, 122, 1)", fontSize: "22px", fontWeight: 200 /* blue-800 */ }}>
                หน่วยบัญชาการทหารพัฒนา กองบัญชาการกองทัพไทย
                </p>
                <p style={{ color: "rgb(0,0,0)", fontSize: "19px", fontWeight: 500 }}>
  โดย สำนักงานพัฒนาภาค {officeRegion} หน่วยบัญชาการทหารพัฒนา
</p>

                <p style={{ color: "rgb(2,132,199)", fontSize: "20px",marginBottom: "20px" /* sky-600 */ }}>
                  {date
                    ? `ประจำวันที่ ${new Date(date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`
                    : "ประจำวันที่ -"}
                </p>
              </div>
              <img src="/images/images.png" alt="" style={{ width: "75px", height: "65px", objectFit: "contain" }} />
            </div>

            {/* ===== เนื้อหาแต่ละหน่วย (ไม่มีชื่อหน่วยเป็นหัวเรื่องเหนือรูป) ===== */}
            <div style={{ marginTop: "18px", display: "grid", rowGap: "1px" }}>
              {Array.from({ length: unitsCount }, (_, i) => {
                const imgs = getImagesForUnit(i);
                const text = unitMessages[i] || "";
                return (
                  <section key={`unit-sec-${i}`} style={{ display: "grid", rowGap: "0px" }}>
                    {/* รูป */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: imgs.length > 1 ? "1fr 1fr" : "1fr",
                        gap: "5px",
                      }}
                    >
                      {imgs.map((url, idx) => (
                        <img
                            key={`${i}-${idx}`}
                            src={url}
                            alt=""
                            style={{
                            width: "100%",
                            height: "230px",
                            objectFit: "cover",
                            border: "1px solid rgb(156,163,175)",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </div>

                    {/* กล่องข้อความ (ฟอนต์ใหญ่ขึ้น) */}
                    {text && (
                      <div
                        style={{
                          padding: "14px",
                          
                          color: "rgb(0,0,0)",
                          whiteSpace: "pre-line",
                          fontSize: fontSizes[i] || 30, // ใช้ขนาดฟอนต์ที่คำนวณไว้
                          lineHeight: 1.5,
                          maxHeight: "12em", // ประมาณ 3 บรรทัด (1.5em * 3)
                          overflow: "hidden", // ซ่อนเกิน 3 บรรทัด
                        }}
                      >
                        {text}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* ===== FOOTER (กรอบล่าง) ===== */}
            <div
              style={{
                border: "4px solid rgb(30,58,138)",
                borderRadius: "16px",
                padding: "3px",
                marginTop: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                fontFamily: 'TH SarabunPSK',
              }}
            >
              <img src="/images/chrome-logo.png" alt="" style={{ height: "33px", width: "auto", marginLeft: "-10px" }} />
              <img src="/images/qr.png" alt="" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
              <img src="/images/youtube-logo.png" alt="" style={{ height: "33px", width: "auto" }} />
              <img src="/images/qr.png" alt="" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
              <span style={{ color: "rgba(15, 40, 124, 1)", fontSize: "26px", fontWeight: 600, marginBottom: "20px" /* blue-800 */ }}>
                เทิดราชัน ทันสมัย พัฒนา
              </span>
              <img src="/images/facebook-logo.png" alt="" style={{ height: "40px", width: "auto", marginRight: "10px" }} />
              <img src="/images/qr1.png" alt="" style={{ height: "45px", width: "auto", objectFit: "contain" }} />
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleDownload} className="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-800">
              ดาวน์โหลดภาพ (A4)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
