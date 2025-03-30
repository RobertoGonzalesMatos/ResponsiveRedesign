import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import { ReactComponent as Check } from "./check.svg";
import { ReactComponent as ArrowUp } from "./upArrow.svg";
import { ReactComponent as Drop } from "./drop.svg";
type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hasBinaryState?: boolean;
  binaryState?: number;
};

type DropdownSection = {
  title: string;
  items: DropdownItem[];
  useAsDropTitle: boolean;
  useIcon?: boolean;
};

type DropdownProps = {
  sections: DropdownSection[];
  closeOnSelect: boolean;
  onSelect: (section: string, item: DropdownItem, binaryState?: number) => void;
  title?: string;
  defaultSelection?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  sections,
  onSelect,
  closeOnSelect,
  title,
  defaultSelection = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [titleArrowState, setTitleArrowState] = useState<number>(0);
  const [itemStates, setItemStates] = useState<{ [key: string]: number }>({});
  const [arrowHover, setArrowHover] = useState<boolean>(false);
  const [headerHover, setHeaderHover] = useState<boolean>(false);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedIcon, setSelectedIcon] = useState<React.ReactNode>(
    sections
      .flatMap((section) => (section.useIcon ? section.items : []))
      .find((item) => item.icon)?.icon || ""
  );
  const [selected, setSelected] = useState<string>(
    title || sections[0]?.items[0]?.label || "Select"
  );
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>(
    {}
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleItemAction = (
    sectionTitle: string,
    item: DropdownItem,
    idx: number
  ) => {
    if (!item.disabled) {
      handleSelect(sectionTitle, item, idx);
      setArrowHover(true);
    }
  };
  const handleSelect = (
    sectionTitle: string,
    item: DropdownItem,
    idx: number
  ) => {
    if (selectedItems[sectionTitle] === item.label && item.hasBinaryState) {
      const newState = (itemStates[item.label] ?? 0) === 1 ? 2 : 1;
      setItemStates((prev) => ({ ...prev, [item.label]: newState }));
    } else if (item.hasBinaryState) {
      setItemStates((prev) => ({ ...prev, [item.label]: 1 }));
    }
    setSelectedItems((prev) => ({ ...prev, [sectionTitle]: item.label }));

    if (sections[idx].useAsDropTitle === true) {
      console.log(sections[idx].title);
      console.log(item.label);
      setSelected(item.label);
      if (item.hasBinaryState) {
        setTitleArrowState(itemStates[item.label] === 1 ? 2 : 1 || 1);
      } else {
        setTitleArrowState(0);
      }
    }
    if (sections[idx].useIcon || false) {
      setSelectedIcon(item.icon || "");
    }
    if (item.hasBinaryState) {
      onSelect(sectionTitle, item, itemStates[item.label]);
    } else {
      onSelect(sectionTitle, item);
    }
    if (closeOnSelect) setIsOpen(false);
  };
  useEffect(() => {
    if (defaultSelection) {
      sections.forEach((s) => {
        handleSelect(s.title, s.items[0], 0);
      });
      sections.forEach((s) => {
        if (s.useAsDropTitle === true) {
          handleSelect(s.title, s.items[0], 0);
        }
      });
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        headerRef.current?.focus();
      }
      if (e.key === "ArrowDown") {
        setFocusedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, itemsRef.current.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        setFocusedIndex((prev) =>
          prev === null ? itemsRef.current.length - 1 : Math.max(prev - 1, 0)
        );
      } else if (e.key === "Enter" && focusedIndex !== null) {
        itemsRef.current[focusedIndex]?.click();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (focusedIndex !== null) {
      itemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);
  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className="dropdown-header"
        tabIndex={0}
        ref={headerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          setHeaderHover(true);
        }}
        onMouseLeave={(e) => {
          setHeaderHover(false);
        }}
      >
        <div style={{ display: "flex" }}>
          <div className="dropdown-title">{selected}</div>
          {titleArrowState === 1 && (
            <div className="item-icon">
              <ArrowUp className="arrow-icon" />
            </div>
          )}
          {titleArrowState === 2 && (
            <div className="item-icon">
              <ArrowUp className="arrow-icon-down" />
            </div>
          )}
        </div>
        {!headerHover && sections.some((s) => s.useIcon) && (
          <div className="dropdown-icon">{selectedIcon}</div>
        )}
        {headerHover && (
          <div className="dropdown-icon">
            <Drop></Drop>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {sections.map((section, idx) => (
            <React.Fragment key={idx}>
              <div className="dropdown-section">
                <h4 className="dropdown-section-title">{section.title}</h4>
                {section.items.map((item, itemIdx) => (
                  <li
                    tabIndex={0}
                    key={`${idx}-${itemIdx}`}
                    ref={(el) => {
                      itemsRef.current[idx * section.items.length + itemIdx] =
                        el;
                    }}
                    onClick={() => {
                      !item.disabled && handleSelect(section.title, item, idx);
                      if (item.hasBinaryState) {
                        setArrowHover(true);
                      }
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleItemAction(section.title, item, idx)
                    }
                    className={`dropdown-item ${
                      item.disabled ? "disabled" : ""
                    }`}
                    onMouseEnter={(e) => {
                      if (
                        selectedItems[section.title] === item.label &&
                        item.hasBinaryState &&
                        itemStates[item.label] === (1 || 2)
                      ) {
                        setArrowHover(true);
                      }
                    }}
                    onMouseLeave={(e) => {
                      setArrowHover(false);
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {item.icon != null && (
                        <div className="item-icon" style={{ fill: "#FF9DD0" }}>
                          {item.icon}
                        </div>
                      )}
                      <div className="item-label">{item.label}</div>
                    </div>
                    {selectedItems[section.title] === item.label &&
                      !item.hasBinaryState && (
                        <div className="item-icon">
                          <Check></Check>
                        </div>
                      )}
                    {selectedItems[section.title] === item.label &&
                      item.hasBinaryState &&
                      itemStates[item.label] === 1 && (
                        <div style={{ display: "flex" }}>
                          <div className="item-icon">
                            <ArrowUp className="arrow-icon" />
                          </div>
                          {arrowHover && (
                            <div className="item-icon-small-arrow">
                              <ArrowUp className="arrow-icon-down" />
                            </div>
                          )}
                        </div>
                      )}
                    {selectedItems[section.title] === item.label &&
                      item.hasBinaryState &&
                      itemStates[item.label] === 2 && (
                        <div style={{ display: "flex" }}>
                          <div className="item-icon">
                            <ArrowUp className="arrow-icon-down" />
                          </div>
                          {arrowHover && (
                            <div className="item-icon-small-arrow">
                              <ArrowUp className="arrow-icon" />
                            </div>
                          )}
                        </div>
                      )}
                  </li>
                ))}
              </div>
              {idx < sections.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div className="dropdown-section-separator"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
