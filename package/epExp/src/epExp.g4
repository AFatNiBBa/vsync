
grammar epExp;

////////////////////////////////////////////////////////////////////////////

POSITIONAL: '°' | 'º' | 'ª';
HASH: '#';
PLUS: '+';
MINUS: '-';
ESC: '\\';

INT: [0-9]+;
CHAR: .;
    
////////////////////////////////////////////////////////////////////////////

start: value=expr EOF;

any
    : POSITIONAL
    | HASH
    | PLUS
    | MINUS
    | ESC
    | INT
    | CHAR
    ;

base
    : HASH s=MINUS? i=INT           # Positional
    | s=MINUS? i=INT POSITIONAL     # Positional
    | (CHAR | INT | ESC any)*       # Named
    ;
    
expr
    : value=base                    # Wrap
    | value=expr PLUS n=INT?        # Plus
    | value=expr MINUS n=INT?       # Minus
    ;