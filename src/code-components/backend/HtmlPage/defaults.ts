import {HtmlGeneratorFn} from "./interfaces";

export const defaultHtmlFn: HtmlGeneratorFn = async (req, config, codeContent) => {
    return `<!DOCTYPE html>
<html>
    <head>
       ${codeContent.head.join('\n\r\r')}
    </head>
    <body>
       ${codeContent.body.join('\n\r\r')}
    </body>
</html>`;
};
