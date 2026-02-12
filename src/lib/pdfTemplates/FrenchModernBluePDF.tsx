// French Modern Blue Professional CV Template - PDF Version
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import type { PDFTemplateProps } from './types';

// Register fonts (optional - for better typography)
// Font.register({
//   family: 'Montserrat',
//   src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.ttf'
// });

const FrenchModernBluePDF: React.FC<PDFTemplateProps> = ({ cvData, templateConfig }) => {
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            fontFamily: 'Helvetica',
        },
        sidebar: {
            width: '35%',
            backgroundColor: templateConfig.colorScheme.primary,
            padding: 20,
            color: '#ffffff',
        },
        mainContent: {
            width: '65%',
            padding: 30,
        },
        photo: {
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
            alignSelf: 'center',
            objectFit: 'cover',
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10,
            marginTop: 15,
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        sidebarSectionTitle: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 8,
            marginTop: 12,
            textTransform: 'uppercase',
            color: '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: '#ffffff',
            paddingBottom: 4,
        },
        contactItem: {
            fontSize: 9,
            marginBottom: 6,
            flexDirection: 'row',
            alignItems: 'center',
        },
        contactIcon: {
            width: 12,
            marginRight: 6,
        },
        skillItem: {
            fontSize: 9,
            marginBottom: 4,
        },
        languageItem: {
            fontSize: 9,
            marginBottom: 6,
        },
        languageLevel: {
            fontSize: 8,
            color: '#e0e0e0',
            marginLeft: 4,
        },
        mainName: {
            fontSize: 28,
            fontWeight: 'bold',
            color: templateConfig.colorScheme.primary,
            marginBottom: 4,
        },
        mainTitle: {
            fontSize: 14,
            color: templateConfig.colorScheme.secondary,
            marginBottom: 20,
            textTransform: 'uppercase',
        },
        experienceItem: {
            marginBottom: 15,
        },
        experienceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        jobTitle: {
            fontSize: 11,
            fontWeight: 'bold',
            color: templateConfig.colorScheme.primary,
        },
        company: {
            fontSize: 10,
            color: templateConfig.colorScheme.secondary,
            fontStyle: 'italic',
            marginBottom: 3,
        },
        dateRange: {
            fontSize: 9,
            color: '#666666',
        },
        description: {
            fontSize: 9,
            lineHeight: 1.4,
            color: '#333333',
        },
        educationItem: {
            marginBottom: 12,
        },
        degree: {
            fontSize: 10,
            fontWeight: 'bold',
            color: templateConfig.colorScheme.primary,
        },
        institution: {
            fontSize: 9,
            color: '#666666',
            marginBottom: 2,
        },
        interestItem: {
            fontSize: 9,
            marginBottom: 3,
        },
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
    };

    const getLevelLabel = (level: string) => {
        const labels = {
            beginner: 'Débutant',
            intermediate: 'Intermédiaire',
            advanced: 'Avancé',
            native: 'Langue maternelle',
        };
        return labels[level as keyof typeof labels] || level;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Sidebar - Colonne bleue */}
                <View style={styles.sidebar}>
                    {/* Photo */}
                    {cvData.photoDataUrl && (
                        <Image src={cvData.photoDataUrl} style={styles.photo} />
                    )}

                    {/* Coordonnées */}
                    <Text style={styles.sidebarSectionTitle}>Coordonnées</Text>
                    {cvData.personalInfo?.phone && (
                        <Text style={styles.contactItem}>📞 {cvData.personalInfo.phone}</Text>
                    )}
                    {cvData.personalInfo?.email && (
                        <Text style={styles.contactItem}>✉️ {cvData.personalInfo.email}</Text>
                    )}
                    {cvData.personalInfo?.address && (
                        <Text style={styles.contactItem}>📍 {cvData.personalInfo.address}</Text>
                    )}
                    {cvData.personalInfo?.city && cvData.personalInfo?.country && (
                        <Text style={styles.contactItem}>
                            {cvData.personalInfo.city}, {cvData.personalInfo.country}
                        </Text>
                    )}
                    {cvData.personalInfo?.linkedin && (
                        <Text style={styles.contactItem}>🔗 LinkedIn</Text>
                    )}
                    {cvData.personalInfo?.portfolio && (
                        <Text style={styles.contactItem}>🌐 Portfolio</Text>
                    )}

                    {/* Langues */}
                    {cvData.languages && cvData.languages.length > 0 && (
                        <>
                            <Text style={styles.sidebarSectionTitle}>Langues</Text>
                            {cvData.languages.map((lang, index) => (
                                <View key={index} style={styles.languageItem}>
                                    <Text>{lang.name}</Text>
                                    <Text style={styles.languageLevel}>{getLevelLabel(lang.proficiency)}</Text>
                                </View>
                            ))}
                        </>
                    )}

                    {/* Compétences */}
                    {cvData.skills && (
                        <>
                            {cvData.skills.technical && cvData.skills.technical.length > 0 && (
                                <>
                                    <Text style={styles.sidebarSectionTitle}>Compétences Techniques</Text>
                                    {cvData.skills.technical.map((skill, index) => (
                                        <Text key={index} style={styles.skillItem}>• {skill}</Text>
                                    ))}
                                </>
                            )}

                            {cvData.skills.soft && cvData.skills.soft.length > 0 && (
                                <>
                                    <Text style={styles.sidebarSectionTitle}>Compétences Comportementales</Text>
                                    {cvData.skills.soft.map((skill, index) => (
                                        <Text key={index} style={styles.skillItem}>• {skill}</Text>
                                    ))}
                                </>
                            )}
                        </>
                    )}

                    {/* Centres d'intérêt */}
                    <Text style={styles.sidebarSectionTitle}>Centres d'Intérêt</Text>
                    <Text style={styles.interestItem}>• Lecture</Text>
                    <Text style={styles.interestItem}>• Randonnée</Text>
                    <Text style={styles.interestItem}>• Gymnastique</Text>
                </View>

                {/* Main Content - Contenu principal */}
                <View style={styles.mainContent}>
                    {/* Nom et Titre */}
                    <Text style={styles.mainName}>
                        {cvData.personalInfo?.firstName?.toUpperCase()} {cvData.personalInfo?.lastName?.toUpperCase()}
                    </Text>
                    <Text style={styles.mainTitle}>Chargée de Projet</Text>

                    {/* Formation */}
                    {cvData.education && cvData.education.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Formation</Text>
                            {cvData.education.map((edu, index) => (
                                <View key={index} style={styles.educationItem}>
                                    <View style={styles.experienceHeader}>
                                        <Text style={styles.degree}>{edu.degree} - {edu.fieldOfStudy}</Text>
                                        <Text style={styles.dateRange}>
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                        </Text>
                                    </View>
                                    <Text style={styles.institution}>{edu.institution}</Text>
                                    {edu.description && (
                                        <Text style={styles.description}>{edu.description}</Text>
                                    )}
                                </View>
                            ))}
                        </>
                    )}

                    {/* Expérience Professionnelle */}
                    {cvData.experience && cvData.experience.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                            {cvData.experience.map((exp, index) => (
                                <View key={index} style={styles.experienceItem}>
                                    <View style={styles.experienceHeader}>
                                        <Text style={styles.jobTitle}>{exp.position}</Text>
                                        <Text style={styles.dateRange}>
                                            {exp.isCurrent ? 'Depuis ' : ''}{formatDate(exp.startDate)}
                                            {!exp.isCurrent && exp.endDate && ` - ${formatDate(exp.endDate)}`}
                                        </Text>
                                    </View>
                                    <Text style={styles.company}>{exp.company} {exp.location && `- ${exp.location}`}</Text>
                                    <Text style={styles.description}>{exp.description}</Text>

                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <View style={{ marginTop: 4 }}>
                                            {exp.achievements.map((achievement, i) => (
                                                <Text key={i} style={styles.description}>• {achievement}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </>
                    )}

                    {/* Résumé Professionnel */}
                    {cvData.summary && (
                        <>
                            <Text style={styles.sectionTitle}>Profil</Text>
                            <Text style={styles.description}>{cvData.summary}</Text>
                        </>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default FrenchModernBluePDF;
