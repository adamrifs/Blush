import React from "react";
import EmojiPicker from "emoji-picker-react";

// ICONS
import { PiTextB, PiTextItalic, PiTextUnderline, PiSmiley } from "react-icons/pi";
import { LuAlignLeft, LuAlignCenter, LuAlignRight } from "react-icons/lu";

const DetailsStep = ({
    // Basic details
    name, setName,
    email, setEmail,
    phoneNumber, handlePhoneChange,
    errors, setErrors,

    // Country dropdown
    selectedCode, selectedFlag,
    showDropdown, setShowDropdown,
    dropdownRef, filteredCountries,
    searchTerm, setSearchTerm,

    // Card message states
    cardOption, setCardOption,
    editorRef, updateCount,
    showEmoji, setShowEmoji,
    charCount, MAX_CHAR,
    templateClasses, cardTemplate, setCardTemplate,
    previewHTML, clearCardData,

    // Continue action
    validateDetails,
    setCurrentStep,
    setCardMessageData,
}) => {

    const getCardMessageData = () => {
        if (cardOption !== "want_card") {
            return {
                option: cardOption,
                messageHTML: "",
                messageText: "",
                template: ""
            };
        }

        return {
            option: cardOption,
            messageHTML: editorRef.current?.innerHTML || "",
            messageText: editorRef.current?.innerText || "",
            template: cardTemplate
        };
    };

    return (
        <div className="w-full font-Poppins">

            {/* ---------------- NAME ---------------- */}
            <div className="inp w-full flex flex-col gap-1">
                <label className='font-Poppins mb-1'>Name</label>

                <input
                    type='text'
                    placeholder='Your name'
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: "" });
                    }}
                    className={`flex-1 border bg-[#f4f5f7] font-Poppins rounded-full px-6 py-3 outline-none
            ${errors.name ? "border-red-500" : "border-transparent focus:ring-2 focus:ring-[#bca8ff]"}`}
                />

                {errors.name && <p className="text-red-500 text-sm text-right">{errors.name}</p>}
            </div>

            {/* ---------------- EMAIL ---------------- */}
            <div className="inp w-full flex flex-col gap-1 mt-4">
                <label className='font-Poppins mb-1'>Email</label>

                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: "" });
                    }}
                    className={`flex-1 border bg-[#f4f5f7] font-Poppins rounded-full px-6 py-3 outline-none
            ${errors.email ? "border-red-500" : "border-transparent focus:ring-2 focus:ring-[#bca8ff]"}`}
                />

                {errors.email && <p className="text-red-500 text-sm text-right">{errors.email}</p>}
            </div>

            {/* ---------------- PHONE ---------------- */}
            <div className="flex flex-col mt-4">
                <label className='font-Poppins mb-1'>Mobile Number</label>

                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Country code */}
                    <div className='relative sm:w-1/4 w-full'>
                        <div
                            className='bg-[#f4f5f7] rounded-full px-6 py-3 cursor-pointer flex justify-between items-center'
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="flex items-center gap-2">
                                <img src={selectedFlag} alt="flag" className="w-5 h-4" />
                                <span>{selectedCode}</span>
                            </div>
                        </div>

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow max-h-56 overflow-y-auto"
                            >
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border-b outline-none"
                                />

                                {filteredCountries.map((country, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setSearchTerm("");
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={country.flag} className="w-5 h-4" />
                                            <span>{country.name}</span>
                                        </div>
                                        <span>{country.code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Phone number input */}
                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={(e) => {
                            handlePhoneChange(e);
                            setErrors({ ...errors, phone: "" });
                        }}
                        className={`flex-1 border bg-[#f4f5f7] rounded-full px-6 py-3 outline-none
              ${errors.phone ? "border-red-500" : "border-transparent focus:ring-2 focus:ring-[#bca8ff]"}`}
                    />
                </div>
                {errors.phone && <p className="text-red-500 text-sm text-right">{errors.phone}</p>}
            </div>

            {/* ---------------- CARD MESSAGE ---------------- */}
            <div className="cardMessage mt-10 w-full">
                <h1 className='font-Poppins text-2xl text-center font-medium mb-8'>
                    Card Message.
                </h1>

                {/* -------- Option 1 -------- */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <span className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="cardOption"
                            value="want_card"
                            onChange={() => setCardOption("want_card")}
                            className="peer appearance-none w-5 h-5 rounded-full bg-[#f4f5f7] border border-gray-300 cursor-pointer"
                        />

                        <span className="
              absolute w-3 h-3 rounded-full scale-0 peer-checked:scale-100 transition-all
              bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
              border border-[#bca8ff]
            "></span>
                    </span>
                    <span className="text-black text-base">I want a card</span>
                </label>

                {/* -------- Card editor -------- */}
                {cardOption === "want_card" && (
                    <div className="mt-4 w-full flex flex-col items-center">

                        {/* ---- Toolbar ---- */}
                        <div className="w-full bg-[#f7f7f7] rounded-full px-6 py-3 flex items-center gap-6 text-xl shadow-sm">

                            <PiTextB onMouseDown={(e) => { e.preventDefault(); document.execCommand("bold"); updateCount(); }} />

                            <PiTextItalic onMouseDown={(e) => { e.preventDefault(); document.execCommand("italic"); updateCount(); }} />

                            <PiTextUnderline onMouseDown={(e) => { e.preventDefault(); document.execCommand("underline"); updateCount(); }} />

                            <span className='h-5 w-px bg-gray-300'></span>

                            <LuAlignLeft onMouseDown={(e) => { e.preventDefault(); document.execCommand("justifyLeft"); updateCount(); }} />

                            <LuAlignCenter onMouseDown={(e) => { e.preventDefault(); document.execCommand("justifyCenter"); updateCount(); }} />

                            <LuAlignRight onMouseDown={(e) => { e.preventDefault(); document.execCommand("justifyRight"); updateCount(); }} />

                            <PiSmiley className="ml-auto text-2xl cursor-pointer" onMouseDown={(e) => { e.preventDefault(); setShowEmoji(!showEmoji); }} />
                        </div>

                        {/* ---- Emoji picker ---- */}
                        {showEmoji && (
                            <div className="mt-2 z-50">
                                <EmojiPicker onEmojiClick={(e) => {
                                    document.execCommand("insertText", false, e.emoji);
                                    updateCount();
                                }} />
                            </div>
                        )}

                        {/* ---- Editor ---- */}
                        <div className="relative w-full mt-6">
                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={updateCount}
                                onFocus={() => setShowEmoji(false)}
                                className="
        rounded-[25px] border border-[#c5e3bf]
        font-Poppins text-sm sm:text-[16px] bg-white outline-none 
        leading-relaxed text-gray-700 overflow-y-auto
        focus:ring-2 focus:ring-[#bca8ff] transition-shadow
    "
                                style={{
                                    width: "340px",
                                    height: "490px",
                                    padding: "20px",
                                    margin: "0 auto",
                                }}
                                data-placeholder="Write your message..."
                                suppressContentEditableWarning={true}
                            ></div>


                            {/* Placeholder CSS */}
                            <style>{`
                      div[contenteditable]:empty:before {
                        content: attr(data-placeholder);
                        color: #b4b4b4;
                      }
                    `}</style>

                            {/* Character Count & Branding */}
                            <div className="absolute bottom-4 left-34 right-34 flex justify-between px-6 sm:px-8">
                                <p className="tracking-[4px] text-gray-500 text-xs font-chopard opacity-70">
                                    BLUSH
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {charCount}/{MAX_CHAR}
                                </p>
                            </div>
                        </div>

                        {/* ---- Template Selector ---- */}
                        <div className="w-full mt-8">
                            <h2 className="font-Poppins text-lg mb-3">Choose Card Style</h2>

                            <div className="flex flex-wrap gap-4">
                                {[
                                    { id: "icedSilver", label: "Iced Silver" },
                                    // { id: "floral", label: "Floral Edge" },
                                    // { id: "gold", label: "Gold Frame" },
                                    // { id: "pastel", label: "Pastel Soft" },
                                    // { id: "luxury", label: "Luxury Ribbon" }
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setCardTemplate(t.id)}
                                        className={`px-4 py-2 rounded-full border 
                      ${cardTemplate === t.id ? "bg-black text-white" : "bg-white text-black border-gray-400"}`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ---- Preview ---- */}
                        <div className="w-full mt-8 sm:mt-10">
                            <h2 className="font-Poppins text-lg sm:text-xl mb-3">Preview</h2>

                            <div
                                className="relative rounded-[20px] shadow-lg transition-all duration-300"
                                style={{
                                    width: "340px",
                                    height: "490px",
                                    padding: "20px",
                                    margin: "0 auto",
                                    ...templateClasses[cardTemplate]
                                }}
                            >
                                <p className="tracking-[4px] text-[#e00e7d] font-bold text-xl font-chopard opacity-70 text-center pb-4">
                                    BLUSH
                                </p>

                                {/* Luxury ribbon effect */}
                                {cardTemplate === "luxury" && (
                                    <>
                                        <span className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-l-2 border-[#c3a6ff] rounded-tl-xl"></span>
                                        <span className="absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-r-2 border-[#c3a6ff] rounded-tr-xl"></span>
                                        <span className="absolute bottom-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-l-2 border-[#c3a6ff] rounded-bl-xl"></span>
                                        <span className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-[#c3a6ff] rounded-br-xl"></span>
                                    </>
                                )}

                                {previewHTML.trim() === "" ? (
                                    <p className="text-gray-400 text-base mt-5">Your message preview will appear here...</p>
                                ) : (
                                    <div
                                        className="text-gray-800 leading-relaxed text-base sm:text-[18px] break-words break-all whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: previewHTML }}
                                    ></div>

                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* -------- Option 2: Empty Card -------- */}
                <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <span className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="cardOption"
                            value="empty_card"
                            onChange={() => { setCardOption("empty_card"); clearCardData(); }}
                            className="peer appearance-none w-5 h-5 rounded-full bg-[#f4f5f7] border border-gray-300"
                        />
                        <span className="
              absolute w-3 h-3 rounded-full scale-0 peer-checked:scale-100
              bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
            "></span>
                    </span>
                    <span>Send an empty card</span>
                </label>

                {/* -------- Option 3: No Card -------- */}
                <label className="flex items-center gap-3 cursor-pointer mt-6">
                    <span className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name="cardOption"
                            value="no_card"
                            onChange={() => { setCardOption("no_card"); clearCardData(); }}
                            className="peer appearance-none w-5 h-5 rounded-full bg-[#f4f5f7] border border-gray-300"
                        />
                        <span className="
              absolute w-3 h-3 rounded-full scale-0 peer-checked:scale-100
              bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
            "></span>
                    </span>
                    <span>I don’t want a card</span>
                </label>

            </div>

            {/* ---------------- CONTINUE BUTTON ---------------- */}
            <button
                type="button"
                onClick={() => {
                    if (validateDetails()) {
                        setCardMessageData(getCardMessageData());
                        setCurrentStep("shipping");
                    }
                    window.scrollTo(0, 0)
                }}
                className="w-full mt-10 py-3 rounded-full text-white text-lg font-medium
          bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
          border border-[#bca8ff]
          shadow-[0_2px_8px_rgba(0,0,0,0.1)]
          hover:from-[#a27aff] hover:to-[#cda5ff]
          hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
          transition-all duration-300 cursor-pointer"
            >
                Continue to Shipping
            </button>

        </div>
    );
};

export default DetailsStep;
