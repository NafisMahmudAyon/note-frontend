import React from "react";

const Content = ({ html }) => {
  const htmlCode = html;
  console.log(htmlCode);
  return (
    <div
      className="break-words block "
      dangerouslySetInnerHTML={{ __html: htmlCode }}
    />
  );
};

export default Content;

// import React from "react";
// import DOMPurify from "dompurify";

// const Content = ({ html }) => {
//   const sanitizedHTML = DOMPurify.sanitize(html);
//   return (
//     <div
//       className="break-words block"
//       dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
//     />
//   );
// };

// export default Content;
