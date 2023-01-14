import UserModel from '../models/user';
export default function (userID: string, guildID: string) {
    if (!userID) throw new Error('No userID provided');
    if (!guildID) throw new Error('No guildID provided');
    const user = UserModel.findOne({ USERID: userID });
    // const guild = 
}