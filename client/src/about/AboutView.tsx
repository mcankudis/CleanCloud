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
                <p>
                    <br></br>
                    <br></br>
                    Driven by a rapid growth of digital technologies and an increasing demand in availability, <br></br>
                    the world of computing and network infrastructure is in the midst of a profound transformation
                    <br></br>
                    <br></br>
                    <br></br>
                    In the next decade, as existing and new businesses find themselves required to meet client demands of global <br></br>
                    access to digital products and services, the need for efficient and sustainable solutions for  <br></br>
                    data processing and storage will soar.
                    <br></br>
                    <br></br>
                    <br></br>
                    CleanClouds mission is to over existing industry entities and newcomers a product which helps make mindful and efficient decisions <br></br> 
                    when choosing locations for compute- and network-infrastructure.
                    <br></br>
                    <br></br>
                    <br></br>
                    With our CleanCloud, you can easily specify locations and 
                    immediately get information about the CO2 emissions of <br></br>
                    electricity consumption as well as the electricity price of this
                    region. You can also customize the size of <br></br>
                    your data center and specify the expected power 
                    consumption. Our platform gives you a comprehensive <br></br>
                    overview so you can make informed decisions and build a 
                    sustainable data center. Save money, minimize your carbon<br></br>
                    footprint, and increase the efficiency of your business. With 
                    Clean Cloud, you'll find the perfect location for your data <br></br>
                    center with clean energy at its core!
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    CleanCloud was created by a group of students from Berlin University of Technology in the scope of a course project. <br></br>
                    The goal was to create a 'dashboard' for accessing data related to carbon intesity of electricity production and <br></br>
                    build a real-world use case around it. All data is taken from the electricitymaps API and energy prices are calculated <br></br>
                    based on hand picked static data found online.
                    <br></br>
                    <br></br>
                    

                </p>
            </div>
            <h1>Meet the Team</h1>
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
