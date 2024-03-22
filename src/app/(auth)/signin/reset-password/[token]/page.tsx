import AuthResetPasswordForm from "@/components/AuthResetPasswordForm";
import CenteredWrapper from "@/components/CenteredWrapper";

function RestPassword({ params }: { params: { token: string } }) {
	return (
		<CenteredWrapper>
			<AuthResetPasswordForm token={params.token} />
		</CenteredWrapper>
	);
}

export default RestPassword;
