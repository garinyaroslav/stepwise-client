import { FC } from "react";
import { User } from 'lucide-react'
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useProfile } from "@/hooks/useProfile";

interface AvatarProfileLinkProps {
    onClick: () => void;
}

export const AvatarProfileLink: FC<AvatarProfileLinkProps> = ({ onClick }) => {
    const { profile, isProfileLoading } = useProfile();

    const fallbackContent = (() => {
        if (isProfileLoading || !profile) {
            return <User className="h-5 w-5 text-gray-500" />;
        }

        const { firstName = "", lastName = "", username } = profile;

        const fn = firstName.trim();
        const ln = lastName.trim();

        if (fn && ln) return `${fn[0]}${ln[0]}`.toUpperCase();
        if (fn) return fn[0].toUpperCase();
        if (ln) return ln[0].toUpperCase();
        return username[0].toUpperCase();
    })();

    return (
        <Avatar
            onClick={onClick}
            className="w-9 h-9 cursor-pointer"
        >
            {isProfileLoading ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 rounded-full">
                    <User className="h-5 w-5 text-gray-500" />
                </div>
            ) : (
                <AvatarFallback className="bg-gray-200 hover:bg-gray-300 transition-colors text-sm font-semibold">
                    {fallbackContent}
                </AvatarFallback>
            )}
        </Avatar>
    );
};
