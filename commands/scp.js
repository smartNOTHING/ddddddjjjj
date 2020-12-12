const { request, gql } = require('graphql-request');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'scp',
    description: 'scp',
    usage: '',
    execute(args, message) {
        let arg = args[1] ? args[1] : 'L';
        let query = gql`
        {
            searchPages(query: "${args.join(' ')}" filter: { anyBaseUrl: [ "http://scp-wiki.wikidot.com" ] }) {
                url
                wikidotInfo {
                    title
                    rating
                    thumbnailUrl
                    category
                    tags
                }
                alternateTitles {
                    type
                    title
                }
                attributions {
                    type
                    user {
                        name
                        authorInfos {
                            authorPage {
                                url
                            }
                        }
                    }
                }
            }
        }`;

        const rand = gql`
        {
            randomPage(filter: { anyBaseUrl: [ "http://scp-wiki.wikidot.com" ] }) {
                page {
                    url
                    wikidotInfo {
                        title
                        rating
                        thumbnailUrl
                        tags
                    }
                    alternateTitles {
                        type
                        title
                    }
                    attributions {
                        type
                        user {
                            name
                            authorInfos {
                                authorPage {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }`;

        const randtags = gql`
        {
            randomPage(filter: { anyBaseUrl: [ "http://scp-wiki.wikidot.com" ] allTags: [ "${arg.toLowerCase()}" ] }) {
                page {
                    url
                    wikidotInfo {
                        title
                        rating
                        thumbnailUrl
                        tags
                    }
                    alternateTitles {
                        type
                        title
                    }
                    attributions {
                        type
                        user {
                            name
                            authorInfos {
                                authorPage {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }`;

        query = args[1] ? randtags : args[0] == 'r' || args[0] == 'random' ? rand : query;

        request('https://api.crom.avn.sh', query).then((data) => {
            const scp = data.searchPages ? data.searchPages[0] : data.randomPage.page;
            const tags = scp.wikidotInfo.tags;
            const authorinfo = scp.attributions[0].user.authorInfos[0];
            const authorpage = (authorinfo !== undefined) ? authorinfo.authorPage.url : '';

            const e = tags.includes('euclid') ? 'Euclid' : tags.includes('keter') ? 'Keter' : tags.includes('safe') ? 'Safe' : tags.includes('thaumiel') ? 'Thaumiel' : tags.includes('apollyon') ? 'Apollyon' : 'No Class';

            const embed = new MessageEmbed()
                .setTitle(`${scp.wikidotInfo.title} - ${scp.alternateTitles.length ? scp.alternateTitles[0].title : 'No Alt Title'}`)
                .setURL(scp.url)
                .setThumbnail(scp.wikidotInfo.thumbnailUrl)
                .setDescription(`**By:** [${scp.attributions[0].user.name}](${authorpage})\n**Object Class:** ${e}\n**Rating:** ${scp.wikidotInfo.rating}`);

            message.channel.send(embed);
        });
    },

};