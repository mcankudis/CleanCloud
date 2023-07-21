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
        <div className="container m-auto max-w-2xl">
            <h1 className="mt-6">About</h1>

            <p className="mt-1 text-justify">
                Driven by rapid growth of digital technologies and increasing demand in
                availability, the world of computing and network infrastructure is in the midst of a
                profound transformation.
            </p>
            <p className="mt-10 text-justify">
                In the next decade, as existing and new businesses find themselves required to meet
                client demands of global access to digital products and services, the need for
                efficient and sustainable solutions for data processing and storage will soar.
            </p>
            <p className="mt-10 text-justify">
                CleanCloud's mission is to offer existing industry entities and newcomers a product
                facilitating making mindful and efficient decisions when choosing locations for
                compute- and network infrastructure.
            </p>
            <p className="mt-10 text-justify">
                You can easily add locations by clicking on our map, and immediately get information
                about the CO<sub>2</sub> emissions caused by electricity consumption, as well as the
                average electricity price for this region. You can also customize the size of your
                data center and specify a time frame in order to be shown total estimated energy
                consumption and CO<sub>2</sub> emissions.
            </p>
            <p className="mt-10 text-justify">
                Our platform gives you a comprehensive overview so you can make informed decisions
                and build a sustainable data center. Save money, minimize your carbon footprint, and
                increase the efficiency of your business.
            </p>
            <p className="mt-6 text-justify">
                <b>
                    With CleanCloud, you'll find the perfect location for your data center with
                    clean energy at its core!
                </b>
            </p>

            <p className="mt-6 text-justify">
                CleanCloud was created by a group of students from Berlin University of Technology
                as a project assignment in a course. The goal was to create a 'dashboard' for
                accessing data related to carbon intesity of electricity production and build a
                real-world use case around it, focusing on software engineering processes, such as
                working in an agile way with modern technologies, Git, and DevOps. All CO
                <sub>2</sub>-related data is sourced from{' '}
                <a href="https://www.electricitymaps.com/">Electricitymaps</a> and energy prices are
                calculated based on hand picked statistical data found online.
            </p>

            <h1 className="mt-10">Meet the Team</h1>

            <div className="flex justify-center mb-10">
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
