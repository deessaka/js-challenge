import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { shortcutHints } from './shortcut_catalog.js';
import { COLORS } from './theme.js';
export const LoginView = ({ environment, browserOpened, onSubmit, errorMessage, }) => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState(errorMessage);
    const handleSubmit = async (val) => {
        const trimmed = val.trim();
        if (!trimmed) {
            setLocalError('Le token API ne peut pas être vide.');
            return;
        }
        setIsLoading(true);
        setLocalError(null);
        try {
            await onSubmit(trimmed);
        }
        catch (err) {
            setIsLoading(false);
            setLocalError(err instanceof Error ? err.message : 'Échec de connexion');
        }
    };
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: COLORS.primary, padding: 1, width: 68, children: [_jsx(Box, { justifyContent: "center", marginBottom: 1, children: _jsx(Text, { color: COLORS.primary, bold: true, children: "\u26A1 CONNEXION CODOJO" }) }), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsxs(Text, { color: COLORS.cyan, bold: true, children: ["Environnement : ", environmentLabel(environment)] }), _jsxs(Text, { color: COLORS.text, children: ["1.", ' ', browserOpened
                                ? 'Votre profil Codojo est ouvert dans le navigateur.'
                                : 'Ouvrez votre profil Codojo dans le navigateur.'] }), _jsx(Text, { color: COLORS.text, children: "2. Cliquez sur \u00AB G\u00E9n\u00E9rer un token CLI \u00BB." }), _jsx(Text, { color: COLORS.text, children: "3. Collez votre token ci-dessous." })] }), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { color: COLORS.textMuted, children: "Collez votre token API :" }), _jsx(Box, { borderStyle: "single", borderColor: COLORS.borderFocus, paddingX: 1, children: _jsx(TextInput, { value: token, onChange: setToken, onSubmit: handleSubmit, mask: "*", placeholder: "oat_MQ.xxxx..." }) })] }), isLoading && (_jsx(Box, { marginBottom: 1, children: _jsxs(Text, { color: COLORS.warning, children: [_jsx(Spinner, { type: "dots" }), " Authentification en cours..."] }) })), localError && !isLoading && (_jsx(Box, { marginBottom: 1, children: _jsxs(Text, { color: COLORS.error, bold: true, children: ["\u2717 ", localError] }) })), _jsx(Box, { justifyContent: "space-between", borderStyle: "single", borderColor: COLORS.border, paddingX: 1, children: _jsx(Text, { color: COLORS.textMuted, children: shortcutHints(['login-submit', 'login-quit']) }) })] }));
};
function environmentLabel(environment) {
    return environment === 'production'
        ? 'production'
        : environment === 'development'
            ? 'développement'
            : 'staging';
}
//# sourceMappingURL=LoginView.js.map