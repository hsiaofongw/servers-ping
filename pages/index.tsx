import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import React from 'react';
import got from 'got';
import { Random } from '../helpers/random';
import { ResponseCheck } from '../helpers/responseCheck';

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

class RecordPreview extends React.Component<{ response: ISimplifiedResponse }, {}> {

    anomalyCheck(x: ISimplifiedResponse): boolean {
        return ResponseCheck.anomalyDetech(x);
    }

    render() {
        const anomaly = this.anomalyCheck(this.props.response);
        if (anomaly) {
            return (
                <div 
                    className="mr-1" 
                >
                    <Rect color={"#d33682"} />
                </div>
            );
        }
        else {
            return (
                <div 
                    className="mr-1" 
                >
                    <Rect color={"#2aa198"} />
                </div>
            );
        }
    }
}

class RecordsPreview extends React.Component<IRecordsPreviewProps, {}> {

    render() {

        const nPick = 30;
        const responses = Random.simpleRandomSampling<ISimplifiedResponse>(this.props.responses, nPick);

        let reportWords = "No report(s).";
        if (responses.some(r => ResponseCheck.anomalyDetech(r))) {
            reportWords = "Anomaly(ies) exists.";
        }

        return (
            <div className="mb-8">
            <h2 className="font-sans text-lg mb-4">{responses[0].siteName}</h2>
            <h3 className="mb-4">{`一天之内：${reportWords}`}</h3>
            <div className="flex flex-nowrap max-h-16 border-2 border-gray-400 p-1 pr-0 mb-8">
                {responses.map(r => <RecordPreview key={r.requestId} response={r} />)}
            </div>
            </div>
        );
    }
}

class DailyLog extends React.Component<IDailyLogProps, {}> {
    render() {
        return <div className="mb-8">
            <h3 className="text-lg mb-4">{`${this.props.monthName} ${this.props.day}:`}</h3>
            <div>
                {this.props.content.map(p => <p key={p} className="mb-4">{p}</p>)}
            </div>
        </div>;
    }
}

class RecordsSection extends React.Component {
    render() {
        return <div className="mb-8">
            <h2 className="text-2xl mb-8">监测记录概要</h2>
            {this.props.children}
        </div>;
    }
}

class LogsSection extends React.Component {
    render() {
        return <div className="mb-8">
            <h2 className="text-2xl mb-8">日志记录</h2>
            {this.props.children}
        </div>;
    }
}

export default class Home extends React.Component<IHomeProps, {}> {

    constructor(props: IHomeProps) {
        super(props);
    }

    classifyByURL(responses: ISimplifiedResponse[]): IndexedISimplifiedResponses {
        let idx = {};
        for (const res of responses) {
            if (!(res.url in idx)) {
                idx[res.url] = [];
            }
            idx[res.url].push(res);
        }

        return idx;
    }


    render() {

        const title = "所有子系统状态正常";

        const headEle = <Head>
            <title>{title}</title>
        </Head>;

        const responses = this.props.responses;
        const indexedResponses = this.classifyByURL(responses);

        let recordsPreviews = [];
        for (const k in indexedResponses) {
            recordsPreviews.push(
                <RecordsPreview key={k} responses={indexedResponses[k]} />
            );
        }

        return <div className="mt-8 ml-auto mr-auto max-w-3xl p-4">
            {headEle}
            <h1 className="font-sans text-3xl mb-8">{title}</h1>
            <hr className="mb-8"/>
            <RecordsSection>
                {recordsPreviews}
            </RecordsSection>
            <hr className="mb-8" />
            <LogsSection>
                {this.props.dailyLogs.map(l => <DailyLog {...l} />)}
            </LogsSection>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async context => {

    const apiEndPoint = "https://servers-ping.vercel.app/api";
    const responses = await got(`${apiEndPoint}/responses`).json();
    const targets = await got(`${apiEndPoint}/watchlist`).json();
    const dailyLogs = await got(`${apiEndPoint}/dailylogs`).json();

    return {
        props: {
            targets, responses, dailyLogs
        }
    };
}