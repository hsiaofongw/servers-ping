import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import React from 'react';
import styles from '../styles/Home.module.scss';
import got from 'got';

class Status extends React.Component<IStatusProps, {}> {

    constructor(props: IStatusProps) {
        super(props);
    } 

    render() {
        return <div></div>;
    }
}

export default class Home extends React.Component<IHomeProps, {}> {
    constructor(props: IHomeProps) {
        super(props);
    }

    render() {

        const title = "所有子系统状态正常";
        const titleEle = <h1>{title}</h1>;

        const reportWords = "报告：所有子系统状态正常．";
        const reportEle = <p>{reportWords}</p>;

        const headEle = <Head>
            <title>{title}</title>
        </Head>;

        const targetEles = this.props.targets.map(target => {
            return <h2 key={target.url} >{target.siteName}</h2>
        });

        return <div className={styles.paper}>
            {headEle}
            {titleEle}
            {reportEle}
            <div>{targetEles}</div>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async context => {

    const apiEndPoint = "https://servers-ping.vercel.app/api";
    const responses = await got(`${apiEndPoint}/responses`).json();
    const targets = await got(`${apiEndPoint}/watchlist`).json();

    return {
        props: {
            targets, responses
        }
    };
}