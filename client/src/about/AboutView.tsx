import { useEffect, useState } from 'react';
import { httpService } from '../HttpService';
import { Member } from './Member';
const APIURL = 'https://api.github.com/users/';

async function getMembers() {
    const miko: Member = {
        name: 'Miko Cankudis',
        github: 'https://github.com/mcankudis',
        image: await getUserAvatar('mcankudis'),
        role: 'Fullstack Developer',
    };
    const Teo: Member = {
        name: 'Teoman Widenbeck',
        github: 'https://github.com/TeoDevGerman',
        image: await getUserAvatar('TeoDevGerman'),
        role: 'Frontend Developer',
    };
    const Johanna: Member = {
        name: 'Johanna Victoria Kaiser',
        github: 'https://github.com/joschjosch1',
        image: await getUserAvatar('joschjosch1'),
        role: 'Business software developer',
    };
    const Luca: Member = {
        name: 'Luca Lichterman',
        github: 'https://github.com/L1ghtman',
        image: await getUserAvatar('L1ghtman'),
        role: 'Game Developer',
    };
    return [miko, Teo, Johanna, Luca];
}

async function getUserAvatar(username: string) {
    const res = await httpService.fetch<{ avatar_url: string }>(APIURL + username);
    if (res.success) {
        return res.data.avatar_url;
    }
    return '';
}

export const AboutView = () => {
    const [members, setMembers] = useState<Member[]>([]);
    useEffect(() => {
        getMembers().then((members) => {
            setMembers(members);
        });
    }, []);

    return (
        <div>
            <h1>About</h1>
            <div className="flex justify-center">
                <div className="row">
                    {members.map((member) => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 p-2"
                            key={member.name}
                        >
                            <figure
                                className="col  md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800 "
                                key={member.name}
                            >
                                <img
                                    className="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full  "
                                    src={member.image}
                                    alt=""
                                    width="384"
                                    height="512"
                                />
                                <div className="pt-6 md:p-8 text-center md:text-left space-y-4">
                                    <figcaption className="font-medium">
                                        <a href={member.github}>{member.github}</a>
                                        <div className="text-slate-700 dark:text-slate-500">
                                            {member.role}
                                        </div>
                                    </figcaption>
                                </div>
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
