import { View, Text } from 'react-native'
import React from 'react'
import { color } from '../../assets/color'


const profil = () => {

    const [username, setUsername] = useState("Default");
    const [email, setEmail] = useState('Default@abc.ca');
    const [profilePic, setProfilePic] = useState('');
    const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <Text>profil</Text>
    </View>
  )
}

export default profil