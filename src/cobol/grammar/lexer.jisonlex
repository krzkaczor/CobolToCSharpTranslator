%lex

%x string

%%
<<EOF>>               return 'EOF';

/* keywords */
'DIVISION'            return 'DIVISION';

'ID'                  return 'IDENTIFICATION';
'IDENTIFICATION'      return 'IDENTIFICATION';
'PROGRAM-ID'          return 'PROGRAM-ID';

'PROCEDURE'           return 'PROCEDURE';

/* verbs */
'DISPLAY'             return 'DISPLAY';


'.'                   return 'DOT';
[a-zA-Z0-9]+          return 'ID';

["]                   this.begin("string");
<string>["]           this.popState();
<string>[^"\n]*       return "STRING";


\s+                   /* skip whitespace */
