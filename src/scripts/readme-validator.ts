import { PackageJson } from '../package-json'
import { getBadgeSection, getCustomSections } from '../readme-sections'
import { validateAndUpdate } from '../readme-validator'
import { BadgeType } from '../structures'

const packageJson = PackageJson.getPackageJson()
const badgeSection = getBadgeSection({
	badgeTypes: Object.values(BadgeType),
	linkedInUsername: 'coltenkrauter',
	packageJson,
})
const sections = getCustomSections(packageJson)

validateAndUpdate({ badgeSection, sections })
