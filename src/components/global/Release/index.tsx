import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "@arco-design/web-react/dist/css/arco.css";
import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';

interface Asset {
    header: string;
    description: string;
    name: string;
    browser_download_url: string;
    size: string;
}

interface GitHubAsset {
    name: string;
    browser_download_url: string;
    size: number;
}

interface GitHubRelease {
    name: string;
    assets: GitHubAsset[];
}

interface ReleaseProps {
    // 如果有props可以在这里定义
}

const PLATFORM_MAPPING: Record<string, { header: string; description: string }> = {
    'windows-amd64': { header: 'Microsoft Windows', description: 'Windows Intel x86-64 bit' },
    'windows-386': { header: 'Microsoft Windows', description: 'Windows Intel x86-32 bit' },
    'linux-amd64': { header: 'Linux', description: 'Linux 64bit' },
    'linux-386': { header: 'Linux', description: 'Linux 32bit' },
    'darwin-arm': { header: 'Apple macOS (Apple)', description: 'macOS Apple 64bit' },
    'darwin-amd': { header: 'Apple macOS (Intel)', description: 'macOS Intel 64bit' },
};

function bytesToAuto(bytes: number): string {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

async function fetchGoctlReleases(): Promise<Asset[]> {
    try {
        const response = await axios.get<GitHubRelease[]>(
            'https://api.github.com/repos/zeromicro/go-zero/releases',
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'goctl-version-checker'
                }
            }
        );

        const targetRelease = response.data.find(release =>
            release.name?.startsWith('goctl/') && release.assets.length > 0
        );

        if (!targetRelease) {
            return [];
        }

        const zipAssets: Asset[] = [];

        for (const asset of targetRelease.assets) {
            if (!asset.name.endsWith('.zip')&&!asset.name.endsWith('.tar.gz')) continue;

            // 查找匹配的平台
            const platformKey = Object.keys(PLATFORM_MAPPING).find(key =>
                asset.name.includes(key)
            );

            if (!platformKey) continue;

            const platformInfo = PLATFORM_MAPPING[platformKey];

            zipAssets.push({
                header: platformInfo.header,
                description: platformInfo.description,
                name: asset.name,
                browser_download_url: asset.browser_download_url,
                size: bytesToAuto(asset.size)
            });
        }

        return zipAssets;
    } catch (error) {
        console.error('Error fetching releases:', error);
        return [];
    }
}

function Release(props: ReleaseProps): JSX.Element {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReleases = async () => {
            try {
                setLoading(true);
                const data = await fetchGoctlReleases();
                setAssets(data);
            } catch (err) {
                setError('Failed to load releases');
                console.error('Error loading releases:', err);
            } finally {
                setLoading(false);
            }
        };

        loadReleases();
    }, []);

    if (loading) {
        return <div>Loading releases...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (assets.length === 0) {
        return <div>No releases found</div>;
    }

    return (
        <div>
            <DocsCards>
                {assets.map((item, index) => (
                    <DocsCard
                        key={index}
                        header={item.header}
                        href={item.browser_download_url}
                    >
                        <p>{item.description}</p>
                        <a>{item.name}（{item.size}）</a>
                    </DocsCard>
                ))}
            </DocsCards>
        </div>
    );
}

export default Release;