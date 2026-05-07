import { Link } from "react-router-dom";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function PrintToolbar({ title = "Printable sheet", subtitle, exportPath }) {
  const { ui } = useLanguage();
  const printNow = () => window.print();
  return (
    <div className="print-toolbar no-print">
      <div>
        <div className="eyebrow">{ui("printExport")}</div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="print-actions">
        <button className="primary-button" type="button" onClick={printNow}>{ui("printSavePdf")}</button>
        {exportPath && <a className="secondary-button" href={exportPath} download>{ui("downloadMarkdown")}</a>}
        <Link className="secondary-button" to="/print">{ui("printHub")}</Link>
      </div>
    </div>
  );
}
