import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import React from 'react';
import got from 'got';

class Rect extends React.Component<IRectProps, {}> {
    render() {
        return <svg version="1.1"
            baseProfile="full"
            width="100%" height="100%"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="100%" height="100%" fill={this.props.color || "white"} />
        </svg>;
    }
}

class RecordsPreview extends React.Component<{}, {}> {
    render() {
        return <div className="mb-8">
        <h2 className="font-sans text-lg mb-4">探索子博客主站</h2>
        <h3 className="mb-4">最近 24 小时：No report(s).</h3>
        <div className="flex flex-nowrap max-h-16 border-2 border-gray-400 p-1 mb-8">
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
            <div className="border-gray-400 border-2 mr-1 hover:border-gray-200 cursor-pointer" ><Rect /></div>
        </div>
    </div>;
    }
}

export default class Home extends React.Component<IHomeProps, {}> {
    constructor(props: IHomeProps) {
        super(props);
    }

    render() {

        const title = "所有子系统状态正常";

        const headEle = <Head>
            <title>{title}</title>
        </Head>;

        // const targetEles = this.props.targets.map(target => {
        //     return <h2 key={target.url} >{target.siteName}</h2>
        // });

        return <div className="mt-8 ml-auto mr-auto max-w-3xl p-4">
            {headEle}
            <h1 className="font-sans text-3xl mb-8">所有子系统状态正常</h1>
            <hr className="mb-8"/>
            <div className="mb-8">
                <h2 className="text-2xl mb-8">监测记录概要</h2>
                <RecordsPreview />
                <RecordsPreview />
            </div>
            <hr className="mb-8" />
            <div className="mb-8">
                <h2 className="text-2xl mb-8">日志记录</h2>
                <div className="mb-8">
                    <h3 className="text-lg mb-4">May 18:</h3>
                    <p>No report(s).</p>
                </div>
                <div className="mb-8">
                    <h3 className="text-lg mb-4">May 17:</h3>
                    <p>No report(s).</p>
                </div>
                <div className="mb-8">
                    <h3 className="text-lg mb-4">May 16:</h3>
                    <p>No report(s).</p>
                </div>
            </div>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async context => {

    // const apiEndPoint = "https://servers-ping.vercel.app/api";
    // const responses = await got(`${apiEndPoint}/responses`).json();
    // const targets = await got(`${apiEndPoint}/watchlist`).json();

    return {
        props: {
            // targets, responses
        }
    };
}