import { ScrollArea } from "@/components/ui/scroll-area";

export default function Help() {
	return (
		<div className="w-full h-full flex">
			<ScrollArea className="h-[calc(100vh-108px)] px-24 w-full">
				<article className="prose prose-gray dark:prose-invert max-w-4xl mx-auto pb-12">
					<h1 className="text-2xl font-semibold md:text-3xl">Help Center</h1>
					<section className="mt-4">
						<h2 className="text-xl font-semibold md:text-2xl">
							Getting Started
						</h2>
						<p className="mt-2">
							Welcome to the book publishing service dashboard! This
							user-friendly platform streamlines the publishing process,
							allowing you to upload your book, manage details, track sales, and
							get support – all in one convenient location.
						</p>
						<p className="mt-2">
							To get started, simply sign in using your existing account
							credentials. If you're new to the platform, creating an account is
							quick and easy. Click the prominent "Sign Up" button and follow
							the straightforward registration process.
						</p>
						<p className="mt-2">
							Once logged in, familiarize yourself with the intuitive dashboard
							layout. Each section is clearly labeled to guide you through the
							different functionalities.
						</p>
					</section>
					<section className="mt-8 flex flex-col gap-2 text-lg">
						<h2 className="text-xl font-semibold md:text-2xl mb-2">
							Uploading Your Masterpiece
						</h2>
						<p>
							Ready to share your book with the world? Head to the dedicated
							"Upload" section within the dashboard. Click the readily
							identifiable "Upload Book" button to initiate the upload process.
						</p>
						<p>
							Our platform currently accepts manuscripts in PDF format for
							optimal quality and consistency. Once you've selected the file,
							you'll be prompted to enter essential details. This includes your
							book's title, capturing the essence of your work, your author
							name, and a captivating description that will entice potential
							readers.
						</p>
					</section>
					<section className="mt-8">
						<h2 className="text-xl font-semibold md:text-2xl">
							Managing Book Details
						</h2>
						<p className="mt-2">
							You can edit book details like title, author, and description by
							navigating to the 'My Books' section in the dashboard. Click on
							the 'Edit' button next to the book you want to edit. Make sure to
							save your changes before leaving the page.
						</p>
					</section>
					<section className="mt-8">
						<h2 className="text-xl font-semibold md:text-2xl">
							Sales and Royalties
						</h2>
						<p className="mt-2">
							To view sales data and royalties earned from book sales, navigate
							to the 'Sales' section in the dashboard. Here, you can view
							detailed reports on your book sales and the royalties you have
							earned.
						</p>
					</section>
					<section className="mt-8">
						<h2 className="text-xl font-semibold md:text-2xl">
							Troubleshooting
						</h2>
						<p className="mt-2">
							If you encounter any issues such as upload errors or display
							issues, please check our 'Troubleshooting' section for common
							issues and their solutions. If you can't find a solution to your
							problem, please don't hesitate to contact our support team.
						</p>
					</section>
					<section className="mt-8">
						<h2 className="text-xl font-semibold md:text-2xl">
							Contact Support
						</h2>
						<p className="mt-2">
							If you need further assistance, you can get in touch with our
							customer support team by navigating to the 'Contact Support'
							section in the dashboard. Fill out the contact form with your
							query, and our team will get back to you as soon as possible.
						</p>
					</section>
				</article>
			</ScrollArea>
		</div>
	);
}
