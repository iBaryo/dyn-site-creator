import {HtmlGeneratorFn} from "./interfaces";

export const defaultHtmlFn: HtmlGeneratorFn = async (req, config, codeContent) => {
    // todo: FrontendConfigComponent extends ScriptTagComponent ?

    return `<!DOCTYPE html>
<html>
    <head>
        <script>
            window.config = ${JSON.stringify(config)};
        </script>
        <!-- start head frontend components -->
       ${codeContent.head.join('\n\r\r')}
       <!-- end head frontend components -->         
    </head>
    <body>
        <!-- start body frontend components -->
       ${codeContent.body.join('\n\r\r')}
       <!-- end body frontend components -->             
    </body>
</html>`;
};
